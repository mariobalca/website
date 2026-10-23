import type { H3Event } from 'h3'
import { handleDeploy, MAX_BODY_BYTES } from '../utils/webhook'

// Tamable's deploy webhook: Settings › Sites › Deploy webhook is https://mariobalca.com/api/deploy.
export default defineEventHandler(async (event) => {
  setHeader(event, 'cache-control', 'no-store')

  const body = await readLimitedBody(event)
  if (body === 'too-large') {
    setResponseStatus(event, 413)
    return { ok: false, message: 'Too large.' }
  }

  const config = useRuntimeConfig(event)
  const result = await handleDeploy({
    rawBody: body,
    signature: getHeader(event, 'x-tamable-signature'),
    secret: config.tamableWebhookSecret,
    deployHookUrl: config.forgeDeployHookUrl,
  })

  setResponseStatus(event, result.status)
  return result.body
})

/** Stops reading once the body passes the limit, so a huge request is never held in memory. */
function readLimitedBody(event: H3Event): Promise<Buffer | 'too-large'> {
  if (Number(getHeader(event, 'content-length') ?? 0) > MAX_BODY_BYTES) return Promise.resolve('too-large')

  const request = event.node.req
  return new Promise((resolve) => {
    const chunks: Buffer[] = []
    let size = 0
    request.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > MAX_BODY_BYTES) {
        request.removeAllListeners('data')
        request.pause()
        // The rest is never read; closing the connection after the answer drops it.
        setHeader(event, 'connection', 'close')
        resolve('too-large')
        return
      }
      chunks.push(chunk)
    })
    request.on('end', () => resolve(Buffer.concat(chunks)))
    request.on('error', () => resolve('too-large'))
  })
}
