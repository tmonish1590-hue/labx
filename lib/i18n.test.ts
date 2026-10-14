import { describe, expect, it } from 'vitest'
import { dictionaryForTesting, isSupportedLanguage, readStoredLanguage } from './i18n'

describe('language persistence and translations', () => {
  it('restores only supported saved language values', () => {
    expect(readStoredLanguage('te')).toBe('te')
    expect(readStoredLanguage('hi')).toBe('hi')
    expect(readStoredLanguage('fr')).toBe('en')
    expect(readStoredLanguage(null)).toBe('en')
    expect(isSupportedLanguage('en')).toBe(true)
    expect(isSupportedLanguage('fr')).toBe(false)
  })

  it('contains translated labels for all supported languages', () => {
    expect(dictionaryForTesting.te.dashboard).not.toBe(dictionaryForTesting.en.dashboard)
    expect(dictionaryForTesting.hi.tutor).not.toBe(dictionaryForTesting.en.tutor)
    expect(dictionaryForTesting.en.dashboardTitle).toContain('virtual lab')
  })
})
