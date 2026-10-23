export default defineEventHandler(async (event) => {
  assertBuildTime()
  const slug = getRouterParam(event, 'slug')
  const post = (await allPosts(event)).find(p => p.slug === slug)
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  return post
})
