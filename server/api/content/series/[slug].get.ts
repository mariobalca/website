export default defineEventHandler(async (event) => {
  assertBuildTime()
  const series = await seriesDetail(event, getRouterParam(event, 'slug') ?? '')
  if (!series) throw createError({ statusCode: 404, statusMessage: 'Series not found' })
  return series
})
