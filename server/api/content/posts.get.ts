export default defineEventHandler(async (event) => {
  assertBuildTime()
  return await postSummaries(event)
})
