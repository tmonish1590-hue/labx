export type PendulumReading = { time: number; period: number; g: number; oscillations: number }

export const OSCILLATIONS = 10

export function calculatePendulumReading(length: number, oscillations = OSCILLATIONS): PendulumReading {
  if (!Number.isFinite(length) || !Number.isFinite(oscillations) || length <= 0 || oscillations <= 0) throw new RangeError('Pendulum measurements must be finite and positive.')
  const period = 2 * Math.PI * Math.sqrt(length / 9.81)
  const time = Number((period * oscillations).toFixed(2))
  const measuredPeriod = Number((time / oscillations).toFixed(3))
  const g = Number((4 * Math.PI ** 2 * length / measuredPeriod ** 2).toFixed(2))
  return { time, period: measuredPeriod, g, oscillations }
}

export type CircuitState = { source: boolean; resistor: boolean; ammeter: boolean; voltmeter: boolean; switch: boolean; wires: boolean }

export function calculateCurrent(voltage: number, resistance: number, circuit: CircuitState) {
  const valid = circuit.source && circuit.resistor && circuit.ammeter && circuit.voltmeter && circuit.switch && circuit.wires && Number.isFinite(voltage) && Number.isFinite(resistance) && voltage > 0 && resistance > 0
  return valid ? Number((voltage / resistance).toFixed(3)) : 0
}

export function canStartCircuit(voltage: number, resistance: number, circuit: CircuitState) {
  return calculateCurrent(voltage, resistance, circuit) > 0
}

export function toggleCircuitPart(circuit: CircuitState, part: keyof CircuitState): CircuitState {
  return { ...circuit, [part]: !circuit[part] }
}

export function readStoredTrials<T>(raw: string | null, isTrial: (value: unknown) => value is T): T[] {
  if (!raw) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isTrial) : []
  } catch {
    return []
  }
}

export function isPendulumTrial(value: unknown): value is { length: number; time: number; oscillations: number; period: number; g: number } {
  return typeof value === 'object' && value !== null && ['length', 'time', 'oscillations', 'period', 'g'].every((key) => typeof (value as Record<string, unknown>)[key] === 'number')
}

export function isCircuitTrial(value: unknown): value is { voltage: number; resistance: number; current: number } {
  return typeof value === 'object' && value !== null && ['voltage', 'resistance', 'current'].every((key) => typeof (value as Record<string, unknown>)[key] === 'number')
}
