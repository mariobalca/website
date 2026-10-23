import { sitemapEntries, sitemapXml } from '../utils/feeds'

// The site's own pages; posts, tags and series come from Tamable.
const PAGES = ['/', '/blog', '/series', '/about']

export default defineEventHandler(async (event) => {
  assertBuildTime()
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  const entries = sitemapEntries(PAGES, await allPosts(event), await seriesSummaries(event))
  return sitemapXml(entries, useRuntimeConfig(event).public.siteUrl)
})
