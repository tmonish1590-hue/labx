import { generateText } from 'ai'
import { getTutorLanguageInstruction } from '@/lib/i18n'
import { validateTutorRequest } from '@/lib/tutor-validation'

const MAX_BODY_BYTES = 16_384
const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 20
const requestBuckets = new Map<string, { count: number; resetAt: number }>()

function getClientKey(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'
}

function isRateLimited(request: Request) {
  const now = Date.now()
  const key = getClientKey(request)
  const current = requestBuckets.get(key)
  if (!current || current.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  current.count += 1
  return current.count > MAX_REQUESTS_PER_WINDOW
}

export async function POST(request: Request) {
  try {
    if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') return Response.json({ error: 'JSON requests are required.' }, { status: 415 })
    const contentLength = Number(request.headers.get('content-length') || 0)
    if (contentLength > MAX_BODY_BYTES) return Response.json({ error: 'Request is too large.' }, { status: 413 })
    if (isRateLimited(request)) return Response.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429, headers: { 'Retry-After': '60' } })
    const body: unknown = await request.json()
    const validation = validateTutorRequest(body)
    if (!validation.ok) return Response.json({ error: validation.error }, { status: 400 })
    const { message, language, experiment } = validation.value
    const result = await generateText({ model: 'openai/gpt-4o-mini', system: `You are the LabX AI science tutor. Help students understand safe virtual experiments without inventing readings. Context: ${experiment}. ${getTutorLanguageInstruction(language)} Keep answers concise, educational, and explain formulas accurately.`, prompt: message })
    return Response.json({ answer: result.text })
  } catch (error) {
    console.error('[tutor] request failed', error instanceof Error ? error.message : 'unknown error')
    return Response.json({ error: 'The tutor is temporarily unavailable. Please try again.' }, { status: 503 })
  }
}
