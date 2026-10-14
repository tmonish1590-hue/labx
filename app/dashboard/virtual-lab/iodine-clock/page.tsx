'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Beaker,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FlaskConical,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Thermometer,
  TriangleAlert,
  Waves,
} from 'lucide-react'

const REAGENTS = [
  { id: 'iodide', name: 'Potassium iodide', formula: 'KI', color: '#E8DCC7' },
  { id: 'peroxide', name: 'Hydrogen peroxide', formula: 'H₂O₂', color: '#D7E7E5' },
  { id: 'starch', name: 'Starch indicator', formula: 'Starch', color: '#E9E4D9' },
] as const

export type Trial = { temperature: number; reactionTime: number }

/** Simulated model: warmer conditions shorten the endpoint delay within safe lab limits. */
export function simulateReactionTime(temperature: number): number {
  const baseline = 18.4
  const temperatureEffect = Math.max(-4, Math.min(8, temperature - 22)) * 0.48
  const deterministicVariation = ((Math.round(temperature) * 7) % 5 - 2) * 0.18
  return Math.max(7.2, Number((baseline - temperatureEffect + deterministicVariation).toFixed(1)))
}

function Stepper({ step }: { step: number }) {
  const steps = ['Setup & Calibration', 'Run Trials & Readings', 'Analysis & Assessment']
  return <div className="flex flex-wrap items-center gap-2 text-xs sm:gap-3">{steps.map((label, index) => <div key={label} className="flex items-center gap-2"><div className={`flex size-7 items-center justify-center rounded-full font-semibold ${index + 1 <= step ? 'bg-[#263746] text-white' : 'border border-[#CBD5E1] bg-white text-[#94A3B8]'}`}>{index + 1 < step ? <Check className="size-3.5" /> : index + 1}</div><span className={index + 1 === step ? 'font-semibold text-[#263746]' : 'text-[#94A3B8]'}>{label}</span>{index < 2 && <ChevronRight className="size-3 text-[#CBD5E1]" />}</div>)}</div>
}

function Bottle({ reagent, selected, onSelect }: { reagent: typeof REAGENTS[number]; selected: boolean; onSelect: () => void }) {
  return <button type="button" onClick={onSelect} aria-pressed={selected} className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-colors ${selected ? 'border-[#4F827D] bg-[#F0F6F5]' : 'border-[#E2E8F0] bg-white hover:border-[#AFC9C5]'}`}><div className="relative flex size-10 items-end justify-center rounded-b-lg rounded-t-md border border-[#CBD5E1] bg-white pb-1"><div className="absolute -top-1.5 h-2 w-4 rounded-sm border border-[#CBD5E1] bg-white" /><div className="h-5 w-7 rounded-b-md" style={{ backgroundColor: reagent.color }} /></div><div className="min-w-0 flex-1"><p className="text-xs font-semibold text-[#263746]">{reagent.name}</p><p className="mt-0.5 text-[11px] text-[#94A3B8]">{reagent.formula} · 10 mL</p></div>{selected && <CheckCircle2 className="size-4 shrink-0 text-[#4F827D]" />}</button>
}

function BeakerScene({ mixed, endpoint, mixing }: { mixed: boolean; endpoint: boolean; mixing: boolean }) {
  return <div className="relative flex min-h-[290px] items-center justify-center overflow-hidden rounded-2xl border border-[#DCE8E5] bg-[#F6FAF9]"><div className="absolute left-5 top-5 flex items-center gap-2 text-[11px] font-medium text-[#4F827D]"><span className={`size-2 rounded-full ${endpoint ? 'bg-[#1D4ED8]' : 'bg-[#AFC9C5]'}`} />{endpoint ? 'Endpoint reached' : mixing ? 'Mixing in progress' : mixed ? 'Ready to react' : 'Beaker empty'}</div><div className="relative mt-8 h-48 w-44 rounded-b-[3.5rem] border-x-4 border-b-4 border-[#8AA9A5] bg-white/65 shadow-inner"><div className={`absolute inset-x-1 bottom-1 h-28 rounded-b-[3rem] transition-colors duration-700 ${endpoint ? 'bg-[#172B72]' : mixed ? 'bg-[#BFD7D3]' : 'bg-[#E8EFEE]'}`}><div className={`absolute inset-x-3 top-3 h-2 rounded-full bg-white/45 ${mixing ? 'animate-pulse' : ''}`} /><Waves className={`absolute bottom-5 left-1/2 size-12 -translate-x-1/2 ${endpoint ? 'text-[#6C83D8]' : 'text-[#7EA7A2]'}`} /></div><div className="absolute -right-8 top-8 h-28 w-12 rounded-r-3xl border-y-4 border-r-4 border-[#8AA9A5]" /></div><div className="absolute bottom-4 right-5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[10px] text-[#64748B]"><p className="font-semibold text-[#263746]">Virtual apparatus</p><p>Readings are simulated</p></div></div>
}

function Chart({ trials }: { trials: Trial[] }) {
  const max = Math.max(...trials.map((trial) => trial.reactionTime), 20)
  return <div className="rounded-xl border border-[#E2E8F0] bg-white p-4"><div className="mb-4 flex items-center justify-between"><div><p className="text-sm font-semibold text-[#263746]">Temperature vs reaction time</p><p className="text-[11px] text-[#94A3B8]">Actual simulated trials</p></div><FlaskConical className="size-4 text-[#4F827D]" /></div><div className="relative h-40 border-b border-l border-[#CBD5E1] bg-[linear-gradient(to_right,transparent_49%,#F1F5F9_50%,transparent_51%),linear-gradient(to_top,transparent_49%,#F1F5F9_50%,transparent_51%)]"><div className="absolute inset-0 flex items-end justify-around px-5 pb-2">{trials.map((trial) => <div key={`${trial.temperature}-${trial.reactionTime}`} className="flex h-full flex-col items-center justify-end"><div className="mb-1 size-3 rounded-full border-2 border-white bg-[#4F827D] shadow-sm" style={{ marginBottom: `${(trial.reactionTime / max) * 72}px` }} /><span className="text-[10px] text-[#64748B]">{trial.temperature}°</span></div>)}</div><span className="absolute -left-5 top-0 text-[10px] text-[#94A3B8]">s</span><span className="absolute -bottom-5 right-0 text-[10px] text-[#94A3B8]">°C</span></div></div>
}

export default function IodineClockPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [temperature, setTemperature] = useState(22)
  const [mixed, setMixed] = useState(false)
  const [mixing, setMixing] = useState(false)
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [endpoint, setEndpoint] = useState(false)
  const [observation, setObservation] = useState('')
  const [message, setMessage] = useState('')
  const [trials, setTrials] = useState<Trial[]>([])
  useEffect(() => {
    const saved = window.localStorage.getItem('labx-iodine-trials')
    if (saved) setTrials(JSON.parse(saved))
  }, [])
  useEffect(() => {
    window.localStorage.setItem('labx-iodine-trials', JSON.stringify(trials))
  }, [trials])

  const requiredReady = selected.length === REAGENTS.length
  const target = useMemo(() => simulateReactionTime(temperature), [temperature])
  useEffect(() => { if (!running) return; const timer = window.setInterval(() => setElapsed((value) => { const next = Number((value + 0.1).toFixed(1)); if (next >= target) { setRunning(false); setEndpoint(true); return target } return next }), 100); return () => window.clearInterval(timer) }, [running, target])

  function mix() { if (!requiredReady) { setMessage('Select all three reagents before mixing.'); return }; setMessage(''); setMixing(true); window.setTimeout(() => { setMixing(false); setMixed(true) }, 900) }
  function startReaction() { if (!requiredReady) return setMessage('Select potassium iodide, hydrogen peroxide, and starch indicator first.'); if (!mixed) return setMessage('Mix the reagents before starting the stopwatch.'); if (temperature < 10 || temperature > 40) return setMessage('Set a temperature between 10°C and 40°C.'); setMessage(''); setEndpoint(false); setElapsed(0); setRunning(true) }
  function reset() { setRunning(false); setEndpoint(false); setElapsed(0); setMixed(false); setMixing(false); setMessage('') }
  function recordTrial() { if (!endpoint) return setMessage('The reading is premature. Wait until the liquid turns blue-black.'); setTrials((current) => [...current, { temperature, reactionTime: Number(elapsed.toFixed(1)) }]); setObservation('Blue-black endpoint observed; colour change was sudden.'); setMessage('Trial recorded. Adjust the temperature for another trial.'); reset() }

  return <main className="min-h-screen bg-[#F5F7FA] text-[#263746]"><header className="flex min-h-[72px] items-center justify-between border-b border-[#E2E8F0] bg-white px-5 py-4 sm:px-8"><div className="flex items-center gap-3"><Link href="/" className="flex size-9 items-center justify-center rounded-lg text-[#64748B] hover:bg-[#F5F7FA]" aria-label="Back to virtual lab"><ArrowLeft className="size-5" /></Link><div><p className="text-xs text-[#94A3B8]">Virtual Lab / Chemistry</p><h1 className="text-lg font-semibold">Iodine Clock Reaction</h1></div></div><div className="hidden items-center gap-2 rounded-full bg-[#F5F7FA] px-3 py-2 text-xs font-medium text-[#64748B] sm:flex"><Clock3 className="size-4 text-[#4F827D]" /> Guided experiment</div></header><div className="mx-auto max-w-7xl p-5 sm:p-8"><div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="mb-2 flex items-center gap-2 text-sm font-medium text-[#4F827D]"><Beaker className="size-4" /> Chemistry · Rate of reaction</p><h2 className="text-2xl font-bold tracking-tight sm:text-3xl">The Iodine Clock Reaction</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">Investigate how temperature changes the time taken for a sudden blue-black colour change.</p></div><Stepper step={endpoint ? 3 : mixed ? 2 : 1} /></div><div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]"><section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_2px_10px_rgba(38,55,70,0.04)] sm:p-6"><div className="mb-5 flex items-center justify-between"><div><h3 className="text-base font-semibold">Setup & calibration</h3><p className="mt-1 text-xs text-[#94A3B8]">Choose reagents, temperature, and mixing controls.</p></div><span className="rounded-full bg-[#DCE8E5] px-2.5 py-1 text-[10px] font-semibold text-[#4F827D]">SIMULATED</span></div><div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]"><div className="flex flex-col gap-3">{REAGENTS.map((reagent) => <Bottle key={reagent.id} reagent={reagent} selected={selected.includes(reagent.id)} onSelect={() => setSelected((current) => current.includes(reagent.id) ? current.filter((id) => id !== reagent.id) : [...current, reagent.id])} />)}<div className="mt-1 rounded-xl bg-[#F5F7FA] p-4"><div className="mb-3 flex items-center justify-between"><label htmlFor="temperature" className="flex items-center gap-2 text-xs font-semibold"><Thermometer className="size-4 text-[#4F827D]" /> Temperature <span className="font-normal text-[#64748B]">(10–40°C)</span></label><span className="text-sm font-bold text-[#4F827D]">{temperature}°C</span></div><input id="temperature" type="range" min="10" max="40" value={temperature} onChange={(event) => setTemperature(Number(event.target.value))} className="w-full accent-[#4F827D]" /><div className="mt-3 flex items-center justify-between text-[10px] text-[#94A3B8]"><span>Cooler</span><span>Warmer = faster</span></div></div><div className="flex gap-2"><button type="button" onClick={mix} disabled={mixing} className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#AFC9C5] px-4 py-2.5 text-sm font-semibold text-[#4F827D] hover:bg-[#F0F6F5] disabled:opacity-50"><Waves className="size-4" />{mixing ? 'Mixing…' : 'Mix reagents'}</button><button type="button" onClick={reset} className="flex size-11 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] hover:bg-[#F5F7FA]" aria-label="Reset beaker"><RotateCcw className="size-4" /></button></div></div><BeakerScene mixed={mixed} endpoint={endpoint} mixing={mixing} /></div></section><aside className="flex flex-col gap-5"><section className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_2px_10px_rgba(38,55,70,0.04)]"><div className="flex items-center justify-between"><div><h3 className="text-base font-semibold">Reaction stopwatch</h3><p className="mt-1 text-xs text-[#94A3B8]">Endpoint delay: {target}s predicted</p></div><div className={`rounded-lg px-3 py-2 font-mono text-lg font-bold ${endpoint ? 'bg-[#E8E7F4] text-[#172B72]' : 'bg-[#F5F7FA] text-[#263746]'}`}>{elapsed.toFixed(1)}s</div></div><button type="button" onClick={startReaction} disabled={running || endpoint} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#263746] px-4 py-3 text-sm font-semibold text-white hover:bg-[#4F827D] disabled:cursor-not-allowed disabled:opacity-50"><Play className="size-4" />{endpoint ? 'Endpoint reached' : running ? 'Reaction running…' : 'Start reaction'}</button>{running && <button type="button" onClick={() => setRunning(false)} className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#64748B]"><Pause className="size-3.5" />Pause stopwatch</button>} {message && <div role="alert" className="mt-4 flex gap-2 rounded-lg border border-[#F1D9B5] bg-[#FFF9F0] p-3 text-xs leading-5 text-[#8A5A20]"><TriangleAlert className="mt-0.5 size-4 shrink-0" />{message}</div>}<button type="button" onClick={recordTrial} className="mt-4 w-full rounded-lg border border-[#AFC9C5] px-4 py-2.5 text-sm font-semibold text-[#4F827D] hover:bg-[#F0F6F5]">Record observation</button></section><section className="rounded-2xl border border-[#E2E8F0] bg-white p-5"><h3 className="text-base font-semibold">Observation note</h3><textarea value={observation} onChange={(event) => setObservation(event.target.value)} placeholder="Describe the colour change and endpoint…" className="mt-3 min-h-24 w-full resize-none rounded-lg border border-[#E2E8F0] p-3 text-sm outline-none focus:border-[#4F827D]" aria-label="Observation note" /><p className="mt-2 text-[11px] text-[#94A3B8]">All apparatus and readings in this workspace are simulated.</p></section></aside></div><div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]"><section className="rounded-2xl border border-[#E2E8F0] bg-white p-5"><div className="mb-4 flex items-center justify-between"><div><h3 className="text-base font-semibold">Analysis & assessment</h3><p className="mt-1 text-xs text-[#94A3B8]">Compare completed trials and identify the trend.</p></div><span className="text-xs font-semibold text-[#4F827D]">{trials.length} trial{trials.length === 1 ? '' : 's'}</span></div>{trials.length === 0 ? <div className="rounded-xl bg-[#F5F7FA] p-5 text-center text-sm text-[#64748B]">Record a completed observation to populate your table.</div> : <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="border-b border-[#E2E8F0] text-[#94A3B8]"><tr><th className="pb-3 font-medium">Trial</th><th className="pb-3 font-medium">Temperature</th><th className="pb-3 font-medium">Reaction time</th><th className="pb-3 font-medium">Observation</th></tr></thead><tbody>{trials.map((trial, index) => <tr key={`${trial.temperature}-${index}`} className="border-b border-[#F1F5F9]"><td className="py-3 font-semibold">{index + 1}</td><td className="py-3">{trial.temperature}°C</td><td className="py-3">{trial.reactionTime}s</td><td className="py-3 text-[#64748B]">Blue-black endpoint</td></tr>)}</tbody></table></div>}</section><Chart trials={trials} /></div><div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#DCE8E5] bg-[#F0F6F5] px-4 py-3 text-xs text-[#4F827D]"><span><strong>Assessment prompt:</strong> How does increasing temperature affect the reaction time?</span><span className="font-semibold">{trials.length >= 2 ? 'Use your data to explain the trend.' : 'Run at least two trials.'}</span></div></div></main>
}
