import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { handleDeploy, isFromTamable } from '../server/utils/webhook'

const secret = 'signing-secret'
const now = Date.parse('2026-10-23T12:00:00Z')
const hook = 'https://forge.laravel.com/servers/1/sites/2/deploy/http?token=abc'

function body(event: string, sentAt = '2026-10-23T11:59:30+00:00') {
  return Buffer.from(JSON.stringify({ event, site_id: 'site', sent_at: sentAt }))
}

function sign(raw: Buffer, key = secret) {
  return `sha256=${createHmac('sha256', key).update(raw).digest('hex')}`
}

function forge(status = 200) {
  const calls: Array<{ url: URL, init: RequestInit }> = []
  const fetch = (async (url: URL, init: RequestInit) => {
    calls.push({ url, init })
    return new Response('ok', { status })
  }) as unknown as typeof globalThis.fetch
  return { calls, fetch }
}

function deploy(rawBody: Buffer, signature: string | undefined, extra: Partial<Parameters<typeof handleDeploy>[0]> = {}) {
  return handleDeploy({ rawBody, signature, secret, deployHookUrl: hook, now, ...extra })
}

describe('the deploy webhook signature', () => {
  it('accepts the HMAC of the raw body with the signing secret', () => {
    const raw = body('content.changed')
    expect(isFromTamable(raw, sign(raw), secret)).toBe(true)
  })

  it('refuses a wrong, missing or wrong-length signature without throwing', () => {
    const raw = body('content.changed')
    expect(isFromTamable(raw, sign(raw, 'other'), secret)).toBe(false)
    expect(isFromTamable(raw, undefined, secret)).toBe(false)
    expect(isFromTamable(raw, 'sha256=short', secret)).toBe(false)
    expect(isFromTamable(raw, sign(raw), '')).toBe(false)
  })

  it('refuses a body changed after signing', () => {
    const raw = body('content.changed')
    expect(isFromTamable(body('test'), sign(raw), secret)).toBe(false)
  })
})

describe('handling a deploy request', () => {
  it('calls the Forge deploy hook for changed content', async () => {
    const { calls, fetch } = forge()
    const raw = body('content.changed')

    const result = await deploy(raw, sign(raw), { fetch })

    expect(result).toEqual({ status: 202, body: { ok: true, message: 'Deploy started.' } })
    expect(calls).toHaveLength(1)
    expect(calls[0]!.init.method).toBe('POST')
    expect(calls[0]!.url.searchParams.get('token')).toBe('abc')
    expect(calls[0]!.url.searchParams.get('forge_deploy_message')).toBe('Tamable: published content changed')
  })

  it('answers the test event without deploying', async () => {
    const { calls, fetch } = forge()
    const raw = body('test')

    expect((await deploy(raw, sign(raw), { fetch })).status).toBe(200)
    expect(calls).toHaveLength(0)
  })

  it('deploys nothing for a bad signature', async () => {
    const { calls, fetch } = forge()

    expect((await deploy(body('content.changed'), 'sha256=nope', { fetch })).status).toBe(401)
    expect(calls).toHaveLength(0)
  })

  it('refuses a replay of an old request, even signed', async () => {
    const { calls, fetch } = forge()
    const raw = body('content.changed', '2026-10-23T11:40:00+00:00')

    expect((await deploy(raw, sign(raw), { fetch })).status).toBe(401)
    expect(calls).toHaveLength(0)
  })

  it('answers 502 when Forge fails, so Tamable retries', async () => {
    const raw = body('content.changed')

    expect((await deploy(raw, sign(raw), { fetch: forge(500).fetch })).status).toBe(502)
    expect((await deploy(raw, sign(raw), {
      fetch: (async () => {
        throw new TypeError('fetch failed')
      }) as unknown as typeof globalThis.fetch,
    })).status).toBe(502)
  })

  it('says so when the secret or the hook is not set, and when the body is not JSON or too large', async () => {
    const raw = body('content.changed')
    expect((await deploy(raw, sign(raw), { secret: '' })).status).toBe(503)
    expect((await deploy(raw, sign(raw), { deployHookUrl: '' })).status).toBe(503)

    const notJson = Buffer.from('nope')
    expect((await deploy(notJson, sign(notJson))).status).toBe(400)

    const huge = Buffer.alloc(20_000, 'a')
    expect((await deploy(huge, sign(huge))).status).toBe(413)
  })

  it('ignores events it does not know', async () => {
    const { calls, fetch } = forge()
    const raw = body('something.else')

    expect((await deploy(raw, sign(raw), { fetch })).body.message).toBe('Event ignored.')
    expect(calls).toHaveLength(0)
  })
})
