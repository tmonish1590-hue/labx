import { generateText } from 'ai'
import { getTutorLanguageInstruction, type Language } from '@/lib/i18n'

const MAX_MESSAGE_LENGTH = 1200
const allowedLanguages = new Set<Language>(['en', 'te', 'hi'])

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()
    if (!body || typeof body !== 'object') return Response.json({ error: 'Invalid request.' }, { status: 400 })
    const { message, language, experiment } = body as { message?: unknown; language?: unknown; experiment?: unknown }
    if (typeof message !== 'string' || message.trim().length === 0 || message.length > MAX_MESSAGE_LENGTH) return Response.json({ error: 'Message must be between 1 and 1200 characters.' }, { status: 400 })
    if (typeof language !== 'string' || !allowedLanguages.has(language as Language)) return Response.json({ error: 'Unsupported language.' }, { status: 400 })
    const context = typeof experiment === 'string' && experiment.length <= 120 ? experiment : 'LabX virtual laboratory'
    const result = await generateText({ model: 'openai/gpt-4o-mini', system: `You are the LabX AI science tutor. Help students understand safe virtual experiments without inventing readings. Context: ${context}. ${getTutorLanguageInstruction(language as Language)} Keep answers concise, educational, and explain formulas accurately.`, prompt: message.trim() })
    return Response.json({ answer: result.text })
  } catch (error) {
    console.error('[tutor] request failed', error instanceof Error ? error.message : 'unknown error')
    return Response.json({ error: 'The tutor is temporarily unavailable. Please try again.' }, { status: 503 })
  }
}
