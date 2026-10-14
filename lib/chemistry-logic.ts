export type FehlingSample = 'glucose' | 'water'

export type FehlingResult = {
  positive: boolean
  label: 'Positive' | 'Negative'
  message: string
}

export function determineFehlingResult(sample: FehlingSample, heated: boolean, reagentsReady: boolean): FehlingResult {
  if (sample !== 'glucose' && sample !== 'water') throw new RangeError('Unsupported Fehling sample.')
  const positive = sample === 'glucose' && heated === true && reagentsReady === true
  return {
    positive,
    label: positive ? 'Positive' : 'Negative',
    message: positive
      ? 'Brick-red precipitate formed: reducing sugar detected.'
      : 'Solution remains blue with no precipitate: negative control.',
  }
}

export function simulateReactionTime(temperature: number): number {
  if (!Number.isFinite(temperature) || temperature < 10 || temperature > 40) throw new RangeError('Reaction temperature must be between 10°C and 40°C.')
  const baseline = 18.4
  const temperatureEffect = Math.max(-4, Math.min(8, temperature - 22)) * 0.48
  const deterministicVariation = ((Math.round(temperature) * 7) % 5 - 2) * 0.18
  return Math.max(7.2, Number((baseline - temperatureEffect + deterministicVariation).toFixed(1)))
}

export function canStartIodineReaction(selectedReagents: number, mixed: boolean, temperature: number): boolean {
  return selectedReagents === 3 && mixed && temperature >= 10 && temperature <= 40
}

export function canRecordIodineTrial(endpointReached: boolean): boolean {
  return endpointReached
}

export function canRecordFehlingObservation(result: boolean | null): boolean {
  return result !== null
}

export function calculateProgress(statuses: string[]): { completed: number; inProgress: number; notStarted: number } {
  return statuses.reduce((counts, status) => {
    if (status === 'Completed') counts.completed += 1
    else if (status === 'In Progress') counts.inProgress += 1
    else counts.notStarted += 1
    return counts
  }, { completed: 0, inProgress: 0, notStarted: 0 })
}

export function uniqueCompletedCount(completedIds: string[]): number {
  return new Set(completedIds).size
}
