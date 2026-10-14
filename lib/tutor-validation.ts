export const MAX_MESSAGE_LENGTH = 1200
export const MAX_EXPERIMENT_LENGTH = 120
export const SUPPORTED_LANGUAGES = ['en', 'te', 'hi'] as const
export type TutorLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export type TutorRequest = { message: string; language: TutorLanguage; experiment: string }

export function validateTutorRequest(body: unknown): { ok: true; value: TutorRequest } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'Invalid request.' }
  const { message, language, experiment } = body as Record<string, unknown>
  if (typeof message !== 'string' || message.trim().length === 0 || message.length > MAX_MESSAGE_LENGTH) return { ok: false, error: 'Message must be between 1 and 1200 characters.' }
  if (typeof language !== 'string' || !SUPPORTED_LANGUAGES.includes(language as TutorLanguage)) return { ok: false, error: 'Unsupported language.' }
  const safeExperiment = typeof experiment === 'string' && experiment.trim().length <= MAX_EXPERIMENT_LENGTH ? experiment.trim() : 'LabX virtual laboratory'
  return { ok: true, value: { message: message.trim(), language: language as TutorLanguage, experiment: safeExperiment } }
}
