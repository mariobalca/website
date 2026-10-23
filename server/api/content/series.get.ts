export default defineEventHandler(async (event) => {
  assertBuildTime()
  return await seriesSummaries(event)
})
