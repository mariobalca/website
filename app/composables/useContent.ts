import type { PostPage, PostSummary, Series, SeriesSummary, Tag } from '#shared/types/content'

export function usePosts() {
  return useFetch<PostSummary[]>('/api/content/posts', { key: 'posts', default: () => [] })
}

export function usePost(slug: string) {
  return useFetch<PostPage>(`/api/content/posts/${encodeURIComponent(slug)}`, { key: `post:${slug}` })
}

export function useSeriesList() {
  return useFetch<SeriesSummary[]>('/api/content/series', { key: 'series', default: () => [] })
}

export function useSeries(slug: string) {
  return useFetch<Series>(`/api/content/series/${encodeURIComponent(slug)}`, { key: `series:${slug}` })
}

export interface TagCount extends Tag {
  count: number
}

export function tagCounts(posts: PostSummary[]): TagCount[] {
  const counts = new Map<string, TagCount>()
  for (const post of posts) {
    for (const tag of post.tags) {
      const entry = counts.get(tag.slug) ?? { ...tag, count: 0 }
      entry.count++
      counts.set(tag.slug, entry)
    }
  }
  return [...counts.values()].sort((a, b) => a.slug.localeCompare(b.slug))
}
