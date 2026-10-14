import { BookOpenCheck, Lightbulb, ListChecks, ShieldCheck, Target } from 'lucide-react'

type ExperimentLearningPanelProps = {
  objective: string
  concept: string
  procedure: string[]
  observation: string
  calculation?: string
  reflection: string
}

export function ExperimentLearningPanel({ objective, concept, procedure, observation, calculation, reflection }: ExperimentLearningPanelProps) {
  return <section aria-labelledby="learning-guide-title" className="mb-5 rounded-2xl border border-[#DCE8E5] bg-[#F7FAF9] p-5 sm:p-6">
    <div className="flex items-start gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#DCE8E5] text-[#4F827D]"><BookOpenCheck className="size-5" /></div><div><h2 id="learning-guide-title" className="text-base font-semibold text-[#263746]">Learning guide</h2><p className="mt-1 text-xs leading-5 text-[#64748B]">A safe, repeatable virtual practical for learners without reliable access to physical equipment.</p></div></div>
    <div className="mt-5 grid gap-4 md:grid-cols-2"><div className="rounded-xl bg-white p-4"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#4F827D]"><Target className="size-4" />Objective</p><p className="mt-2 text-sm leading-6 text-[#263746]">{objective}</p></div><div className="rounded-xl bg-white p-4"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#4F827D]"><Lightbulb className="size-4" />Concept</p><p className="mt-2 text-sm leading-6 text-[#263746]">{concept}</p></div></div>
    <div className="mt-4 rounded-xl bg-white p-4"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#4F827D]"><ListChecks className="size-4" />Procedure</p><ol className="mt-3 grid gap-2 text-sm leading-5 text-[#263746] sm:grid-cols-2">{procedure.map((step, index) => <li key={step} className="flex gap-2"><span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#DCE8E5] text-[11px] font-bold text-[#4F827D]">{index + 1}</span>{step}</li>)}</ol></div>
    <div className="mt-4 grid gap-4 md:grid-cols-3"><div><p className="text-xs font-semibold text-[#4F827D]">Observe</p><p className="mt-1 text-xs leading-5 text-[#64748B]">{observation}</p></div>{calculation && <div><p className="text-xs font-semibold text-[#4F827D]">Calculate</p><p className="mt-1 text-xs leading-5 text-[#64748B]">{calculation}</p></div>}<div><p className="flex items-center gap-1 text-xs font-semibold text-[#4F827D]"><ShieldCheck className="size-3.5" />Reflect</p><p className="mt-1 text-xs leading-5 text-[#64748B]">{reflection}</p></div></div>
  </section>
}
