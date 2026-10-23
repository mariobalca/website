// One address per page: /blog/ and /blog/x/ answer with a 301 to the address without the slash.
// Added first in the stack, because prerendered pages are served before any middleware would run.
export default defineNitroPlugin((nitroApp) => {
  nitroApp.h3App.stack.unshift({
    route: '/',
    handler: eventHandler((event) => {
      // A path with its own redirect rule (Ghost's /{slug}/) goes straight to its target instead.
      if (getRouteRules(event).redirect) return
      const url = getRequestURL(event)
      if (url.pathname.length > 1 && url.pathname.endsWith('/') && !url.pathname.startsWith('/preview/')) {
        return sendRedirect(event, url.pathname.replace(/\/+$/, '') + url.search, 301)
      }
    }),
  })
})
