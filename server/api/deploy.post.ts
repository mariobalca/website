import { handleDeploy } from '../utils/webhook'

// Tamable's deploy webhook: Settings › Sites › Deploy webhook is https://mariobalca.com/api/deploy.
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const result = await handleDeploy({
    rawBody: await readRawBody(event, false),
    signature: getHeader(event, 'x-tamable-signature'),
    secret: config.tamableWebhookSecret,
    deployHookUrl: config.forgeDeployHookUrl,
  })

  setResponseStatus(event, result.status)
  setHeader(event, 'cache-control', 'no-store')
  return result.body
})
