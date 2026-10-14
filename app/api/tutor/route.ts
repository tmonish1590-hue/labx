import { generateText } from 'ai'
import { getTutorLanguageInstruction } from '@/lib/i18n'
import { validateTutorRequest } from '@/lib/tutor-validation'

export async function POST(request: Request) {
  try {
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
