import { describe, expect, it } from 'vitest'
import {
  calculateProgress,
  canRecordFehlingObservation,
  canRecordIodineTrial,
  canStartIodineReaction,
  determineFehlingResult,
  simulateReactionTime,
  uniqueCompletedCount,
} from './chemistry-logic'

describe('chemistry input validation', () => {
  it('rejects impossible reaction temperatures and samples', () => {
    expect(() => simulateReactionTime(Number.NaN)).toThrow(RangeError)
    expect(() => simulateReactionTime(41)).toThrow(RangeError)
    expect(() => determineFehlingResult('invalid' as never, true, true)).toThrow(RangeError)
  })
})

describe('chemistry simulations', () => {
  it('models a warmer iodine trial with a shorter endpoint time', () => {
    expect(simulateReactionTime(30)).toBeLessThan(simulateReactionTime(15))
    expect(simulateReactionTime(22)).toBeGreaterThanOrEqual(7.2)
  })

  it('requires all iodine setup conditions before starting', () => {
    expect(canStartIodineReaction(3, true, 22)).toBe(true)
    expect(canStartIodineReaction(2, true, 22)).toBe(false)
    expect(canStartIodineReaction(3, false, 22)).toBe(false)
    expect(canStartIodineReaction(3, true, 45)).toBe(false)
  })

  it('only records an iodine trial after the endpoint', () => {
    expect(canRecordIodineTrial(false)).toBe(false)
    expect(canRecordIodineTrial(true)).toBe(true)
  })

  it('returns positive glucose and negative water Fehling outcomes', () => {
    expect(determineFehlingResult('glucose', true, true)).toMatchObject({ positive: true, label: 'Positive' })
    expect(determineFehlingResult('water', true, true)).toMatchObject({ positive: false, label: 'Negative' })
    expect(determineFehlingResult('glucose', false, true).positive).toBe(false)
    expect(canRecordFehlingObservation(null)).toBe(false)
    expect(canRecordFehlingObservation(false)).toBe(true)
  })

  it('calculates progress and de-duplicates completed experiments', () => {
    expect(calculateProgress(['Completed', 'Completed', 'In Progress', 'Not Started'])).toEqual({ completed: 2, inProgress: 1, notStarted: 1 })
    expect(uniqueCompletedCount(['iodine', 'iodine', 'ohms'])).toBe(2)
  })
})
