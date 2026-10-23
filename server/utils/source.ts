import type { H3Event } from 'h3'
import type { Post, PostSummary } from '../../shared/types/content'
import { summarize, toPost } from './content'
import { prepareHtml } from './html'
import { createTamableClient, type TamableClient } from './tamable'

let client: TamableClient | undefined
const memo = new Map<string, Promise<unknown>>()

export function tamable(event: H3Event): TamableClient {
  if (!client) {
    const config = useRuntimeConfig(event)
    client = createTamableClient({ apiUrl: config.tamableApiUrl, readKey: config.tamableReadKey })
  }
  return client
}

/** Content routes serve the build and local development, never visitors of the live site. */
export function assertBuildTime(): void {
  if (!import.meta.dev && !import.meta.prerender) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }
}

/** During a build every page asks for the same data; fetch it once. Development always reads fresh. */
function once<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (import.meta.dev) return load()
  if (!memo.has(key)) {
    memo.set(key, load().catch((error) => {
      memo.delete(key)
      throw error
    }))
  }
  return memo.get(key) as Promise<T>
}

/** Every published post in full, newest first. One list request plus one per post, a few at a time. */
export function allPosts(event: H3Event): Promise<Post[]> {
  return once('posts', async () => {
    const api = tamable(event)
    const list = await api.allPosts()
    return mapLimit(list, 4, async (item) => {
      const lookup = await api.getPost(item.slug ?? '')
      if (lookup.kind !== 'found') throw new Error(`Tamable listed ${item.slug} but did not serve it.`)
      const post = toPost(lookup.post)
      return { ...post, html: prepareHtml(post.html) }
    })
  })
}

export async function postSummaries(event: H3Event): Promise<PostSummary[]> {
  return (await allPosts(event)).map(summarize)
}

async function mapLimit<T, R>(items: T[], limit: number, map: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let next = 0
  async function worker() {
    while (next < items.length) {
      const index = next++
      results[index] = await map(items[index]!)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}
