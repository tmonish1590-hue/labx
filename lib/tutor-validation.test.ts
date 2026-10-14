import { describe, expect, it } from 'vitest'
import { validateTutorRequest } from './tutor-validation'

describe('tutor request validation', () => {
  it('normalizes valid input and keeps context bounded', () => {
    const result = validateTutorRequest({ message: '  Explain current  ', language: 'en', experiment: 'Ohm\'s Law' })
    expect(result).toEqual({ ok: true, value: { message: 'Explain current', language: 'en', experiment: "Ohm's Law" } })
  })

  it('rejects empty, oversized, and unsupported input', () => {
    expect(validateTutorRequest({ message: ' ', language: 'en' }).ok).toBe(false)
    expect(validateTutorRequest({ message: 'x'.repeat(1201), language: 'en' }).ok).toBe(false)
    expect(validateTutorRequest({ message: 'hello', language: 'fr' }).ok).toBe(false)
    expect(validateTutorRequest(null).ok).toBe(false)
  })

  it('falls back to a safe generic context when experiment is malformed', () => {
    const result = validateTutorRequest({ message: 'Help', language: 'hi', experiment: 'x'.repeat(121) })
    expect(result).toEqual({ ok: true, value: { message: 'Help', language: 'hi', experiment: 'LabX virtual laboratory' } })
  })
})
