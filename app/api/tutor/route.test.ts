import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

const generateText = vi.fn()
vi.mock('ai', () => ({ generateText }))

let POST: (request: Request) => Promise<Response>
beforeAll(async () => { POST = (await import('./route')).POST })

function request(body: string, headers: Record<string, string> = {}) {
  return new Request('http://localhost/api/tutor', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': crypto.randomUUID(), ...headers },
    body,
  })
}

describe('POST /api/tutor', () => {
  beforeEach(() => {
    generateText.mockReset()
    generateText.mockResolvedValue({ text: 'Use I = V/R.' })
  })

  it('validates input and returns the provider answer', async () => {
    const response = await POST(request(JSON.stringify({ message: '  How do I calculate current? ', language: 'en', experiment: "Ohm's Law" })))
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ answer: 'Use I = V/R.' })
    expect(generateText).toHaveBeenCalledWith(expect.objectContaining({ prompt: 'How do I calculate current?', maxOutputTokens: 500 }))
  })

  it('rejects malformed JSON and unsupported media types before generation', async () => {
    const malformed = await POST(request('{broken'))
    expect(malformed.status).toBe(400)
    const wrongType = await POST(request('hello', { 'content-type': 'text/plain' }))
    expect(wrongType.status).toBe(415)
    expect(generateText).not.toHaveBeenCalled()
  })

  it('rejects invalid payloads without leaking implementation details', async () => {
    const response = await POST(request(JSON.stringify({ message: '', language: 'en' })))
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'Message must be between 1 and 1200 characters.' })
    expect(generateText).not.toHaveBeenCalled()
  })

  it('returns a safe service error when the provider fails', async () => {
    generateText.mockRejectedValueOnce(new Error('provider secret should not escape'))
    const response = await POST(request(JSON.stringify({ message: 'Explain the endpoint', language: 'en' })))
    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({ error: 'The tutor is temporarily unavailable. Please try again.' })
  })

  it('rejects oversized request bodies', async () => {
    const response = await POST(request(JSON.stringify({ message: 'x'.repeat(20_000), language: 'en' })))
    expect(response.status).toBe(413)
    expect(generateText).not.toHaveBeenCalled()
  })

  it('enforces the per-client request limit without calling the provider', async () => {
    const ip = crypto.randomUUID()
    const headers = { 'x-forwarded-for': ip }
    const payload = JSON.stringify({ message: 'Explain current', language: 'en' })
    for (let index = 0; index < 20; index += 1) expect((await POST(request(payload, headers))).status).toBe(200)
    const limited = await POST(request(payload, headers))
    expect(limited.status).toBe(429)
    expect(await limited.json()).toEqual({ error: 'Too many requests. Please try again shortly.' })
  })
})
