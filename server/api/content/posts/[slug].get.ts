export default defineEventHandler(async (event) => {
  assertBuildTime()
  const post = await postPage(event, getRouterParam(event, 'slug') ?? '')
  if (!post) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  return post
})
