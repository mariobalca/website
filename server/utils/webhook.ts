import { createHmac, timingSafeEqual } from 'node:crypto'

/** Tamable re-signs each attempt with a fresh sent_at, so a real retry is never this old. */
const MAX_AGE_MS = 10 * 60 * 1000
const MAX_BODY_BYTES = 10_000

export function isFromTamable(rawBody: Buffer, header: string | undefined, secret: string): boolean {
  if (!secret || !header) return false
  const expected = Buffer.from(`sha256=${createHmac('sha256', secret).update(rawBody).digest('hex')}`)
  const given = Buffer.from(header)
  // timingSafeEqual throws on different lengths, so compare those first.
  return given.length === expected.length && timingSafeEqual(given, expected)
}

export interface DeployRequest {
  rawBody: Buffer | undefined
  signature: string | undefined
  secret: string
  deployHookUrl: string
  fetch?: typeof fetch
  now?: number
}

export interface DeployResult {
  status: number
  body: { ok: boolean, message: string }
}

export async function handleDeploy(request: DeployRequest): Promise<DeployResult> {
  const reply = (status: number, message: string): DeployResult => ({ status, body: { ok: status < 300, message } })

  if (!request.secret || !request.deployHookUrl) {
    return reply(503, 'The deploy webhook is not configured.')
  }

  const rawBody = request.rawBody ?? Buffer.alloc(0)
  if (rawBody.length > MAX_BODY_BYTES) return reply(413, 'Too large.')
  if (!isFromTamable(rawBody, request.signature, request.secret)) return reply(401, 'Bad signature.')

  let payload: { event?: unknown, sent_at?: unknown }
  try {
    payload = JSON.parse(rawBody.toString('utf8'))
  }
  catch {
    return reply(400, 'Not JSON.')
  }

  const sentAt = typeof payload.sent_at === 'string' ? Date.parse(payload.sent_at) : Number.NaN
  if (!Number.isFinite(sentAt) || Math.abs((request.now ?? Date.now()) - sentAt) > MAX_AGE_MS) {
    return reply(401, 'Stale or missing sent_at.')
  }

  if (payload.event === 'test') return reply(200, 'Test received. Nothing deployed.')
  if (payload.event !== 'content.changed') return reply(200, 'Event ignored.')

  const doFetch = request.fetch ?? fetch
  const hook = new URL(request.deployHookUrl)
  hook.searchParams.set('forge_deploy_message', 'Tamable: published content changed')

  try {
    const response = await doFetch(hook, { method: 'POST', signal: AbortSignal.timeout(10_000) })
    if (!response.ok) return reply(502, `Forge answered ${response.status}.`)
  }
  catch {
    return reply(502, 'Forge did not answer.')
  }

  return reply(202, 'Deploy started.')
}
