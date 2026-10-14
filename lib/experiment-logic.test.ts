import { describe, expect, it } from 'vitest'
import { calculateCurrent, calculatePendulumReading, canStartCircuit, isCircuitTrial, isPendulumTrial, readStoredTrials, toggleCircuitPart, type CircuitState } from './experiment-logic'

const closedCircuit: CircuitState = { source: true, resistor: true, ammeter: true, voltmeter: true, switch: true, wires: true }

describe('pendulum calculations', () => {
  it('uses the deterministic small-angle model and returns valid units', () => {
    const reading = calculatePendulumReading(0.6)
    expect(reading.oscillations).toBe(10)
    expect(reading.time).toBeGreaterThan(4)
    expect(reading.period).toBeCloseTo(1.554, 3)
    expect(reading.g).toBeCloseTo(9.8, 1)
  })

  it('changes period predictably with length', () => {
    expect(calculatePendulumReading(0.9).period).toBeGreaterThan(calculatePendulumReading(0.3).period)
  })
})

describe('measurement validation', () => {
  it('rejects non-finite or non-positive pendulum inputs', () => {
    expect(() => calculatePendulumReading(Number.NaN)).toThrow(RangeError)
    expect(() => calculatePendulumReading(0)).toThrow(RangeError)
    expect(() => calculatePendulumReading(1, Infinity)).toThrow(RangeError)
  })
})

describe("Ohm's Law and experiment state", () => {
  it('calculates current only for a complete positive resistive circuit', () => {
    expect(calculateCurrent(6, 100, closedCircuit)).toBe(0.06)
    expect(calculateCurrent(6, 0, closedCircuit)).toBe(0)
    expect(calculateCurrent(6, 100, { ...closedCircuit, switch: false })).toBe(0)
    expect(calculateCurrent(Number.NaN, 100, closedCircuit)).toBe(0)
  })

  it('supports setup transitions without mutating the previous state', () => {
    const open = toggleCircuitPart(closedCircuit, 'switch')
    expect(open.switch).toBe(false)
    expect(closedCircuit.switch).toBe(true)
    expect(canStartCircuit(6, 100, closedCircuit)).toBe(true)
    expect(canStartCircuit(6, 100, open)).toBe(false)
  })

  it('filters malformed saved readings and handles broken JSON', () => {
    const raw = JSON.stringify([{ voltage: 6, resistance: 100, current: 0.06 }, { voltage: 'bad' }, null])
    expect(readStoredTrials(raw, isCircuitTrial)).toHaveLength(1)
    expect(readStoredTrials('{broken', isCircuitTrial)).toEqual([])
    expect(readStoredTrials(JSON.stringify([{ length: 0.6, time: 7.7, oscillations: 10, period: 0.77, g: 9.8 }]), isPendulumTrial)).toHaveLength(1)
  })
})
