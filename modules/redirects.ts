import { defineNuxtModule, useLogger } from 'nuxt/kit'
import { redirectPaths, toPostSummary } from '../server/utils/content'
import { buildRedirects } from '../server/utils/redirects'
import { createTamableClient } from '../server/utils/tamable'

// At build time, turns Ghost's old addresses and Tamable's renamed posts into 301 route rules,
// so the live server redirects without asking Tamable. Also refuses to build an empty blog.
export default defineNuxtModule({
  meta: { name: 'redirects' },
  async setup(_, nuxt) {
    if (nuxt.options.dev || nuxt.options._prepare) return

    const logger = useLogger('redirects')
    const tamable = createTamableClient({
      apiUrl: process.env.NUXT_TAMABLE_API_URL || nuxt.options.runtimeConfig.tamableApiUrl,
      readKey: process.env.NUXT_TAMABLE_READ_KEY ?? '',
    })
    const siteUrl = nuxt.options.runtimeConfig.public.siteUrl

    const [posts, renamed] = await Promise.all([tamable.allPosts(), tamable.redirects()])

    if (!posts.length && process.env.NUXT_ALLOW_EMPTY_BLOG !== 'true') {
      throw new Error('Tamable has no published posts for this site, so the build stopped rather than publish an empty blog. Set NUXT_ALLOW_EMPTY_BLOG=true to build one on purpose.')
    }

    const rules = (nuxt.options.routeRules ??= {})
    const map = buildRedirects({ posts: posts.map(toPostSummary), renamed: redirectPaths(renamed, siteUrl) })
    for (const [from, to] of Object.entries(map)) {
      rules[from] = { redirect: { to, statusCode: 301 } }
      rules[`${from}/`] = { redirect: { to, statusCode: 301 } }
    }
    rules['/tag/**'] = { redirect: { to: '/blog', statusCode: 301 } }
    rules['/author/**'] = { redirect: { to: '/about', statusCode: 301 } }

    logger.info(`${Object.keys(map).length} redirects from ${posts.length} posts and ${renamed.length} renames`)
  },
})
