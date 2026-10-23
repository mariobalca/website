import { rssXml } from '../utils/feeds'

export default defineEventHandler(async (event) => {
  assertBuildTime()
  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return rssXml(await allPosts(event), useRuntimeConfig(event).public.siteUrl)
})
