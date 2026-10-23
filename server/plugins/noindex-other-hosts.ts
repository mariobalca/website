// Only the real address is indexed: the Forge test domain or any other host serving this build stays out of search.
export default defineNitroPlugin((nitroApp) => {
  const siteHost = new URL(useRuntimeConfig().public.siteUrl).host

  nitroApp.hooks.hook('request', (event) => {
    if (getRequestHost(event) !== siteHost) {
      setHeader(event, 'x-robots-tag', 'noindex, nofollow')
    }
  })
})
