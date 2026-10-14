'use client'

import { useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sparkles, X } from 'lucide-react'

type TutorMessage = { id: number; role: 'assistant' | 'user'; text: string }

type ExperimentContext = {
  name: string
  subject: string
  prompt: string
}

const contexts: Record<string, ExperimentContext> = {
  'iodine-clock': { name: 'Iodine Clock Reaction', subject: 'Chemistry', prompt: 'Ask about reaction rates, colour change, timing, or temperature.' },
  'fehlings-test': { name: "Fehling's Test", subject: 'Chemistry', prompt: 'Ask about reducing sugars, reagent setup, heating, or precipitates.' },
  'simple-pendulum': { name: 'Simple Pendulum', subject: 'Physics', prompt: 'Ask about period, length, timing trials, or the pendulum relationship.' },
  'ohms-law': { name: "Ohm's Law Circuit", subject: 'Physics', prompt: 'Ask about voltage, current, resistance, meters, or circuit setup.' },
}

const suggestedQuestions = [
  'What should I check in my setup?',
  'Can you explain the theory simply?',
  'How should I interpret my readings?',
]

export function LabTutor() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<TutorMessage[]>([])
  const context = useMemo(() => Object.entries(contexts).find(([route]) => pathname.includes(route))?.[1], [pathname])

  function openTutor() {
    setOpen(true)
    if (messages.length === 0) {
      setMessages([{ id: 1, role: 'assistant', text: context ? `I’m ready to help with ${context.name}. ${context.prompt}` : 'I’m ready to help with your LabX experiments. Choose a suggested question or ask about a practical.' }])
    }
  }

  function send(text = draft) {
    const value = text.trim()
    if (!value) return
    setMessages((current) => [...current, { id: Date.now(), role: 'user', text: value }])
    setDraft('')
  }

  return <>
    <button type="button" aria-label="Open AI Lab Tutor" onClick={openTutor} className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#4F827D] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#263746]/20 transition hover:bg-[#263746] focus:outline-none focus:ring-2 focus:ring-[#4F827D] focus:ring-offset-2 sm:bottom-6 sm:right-6">
      <Sparkles className="size-4" />AI Lab Tutor
    </button>
    {open && <section aria-label="AI Lab Tutor chat" className="fixed inset-x-3 bottom-3 z-50 flex max-h-[min(680px,calc(100vh-1.5rem))] flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[390px]">
      <header className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F5F7FA] px-4 py-3">
        <div><h2 className="text-sm font-semibold text-[#263746]">AI Lab Tutor</h2><p className="text-xs text-[#64748B]">{context ? `${context.subject} · ${context.name}` : 'LabX experiment support'}</p></div>
        <button type="button" aria-label="Close AI Lab Tutor" onClick={() => setOpen(false)} className="rounded-md p-1.5 text-[#64748B] hover:bg-white"><X className="size-4" /></button>
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4" aria-live="polite">
        {context && <div className="rounded-lg border border-[#DCE8E5] bg-[#F0F6F5] p-3 text-xs leading-5 text-[#496B68]">Experiment context is active. Current readings and simulation state remain in the workspace and will be sent with the backend request.</div>}
        {messages.map((message) => <div key={message.id} className={`max-w-[88%] rounded-xl px-3 py-2.5 text-sm leading-5 ${message.role === 'user' ? 'ml-auto bg-[#4F827D] text-white' : 'bg-[#F5F7FA] text-[#263746]'}`}>{message.text}</div>)}
        <div className="flex items-center gap-2 text-xs text-[#94A3B8]" aria-label="Tutor backend status"><span className="flex gap-1"><span className="size-1.5 rounded-full bg-[#4F827D]" /><span className="size-1.5 rounded-full bg-[#4F827D] opacity-60" /><span className="size-1.5 rounded-full bg-[#4F827D] opacity-30" /></span>Ready for tutor connection</div>
        <div className="flex flex-wrap gap-2">{suggestedQuestions.map((question) => <button key={question} type="button" onClick={() => send(question)} className="rounded-full border border-[#DCE8E5] px-3 py-1.5 text-left text-xs text-[#4F827D] hover:bg-[#F0F6F5]">{question}</button>)}</div>
      </div>
      <form onSubmit={(event) => { event.preventDefault(); send() }} className="flex gap-2 border-t border-[#E2E8F0] p-3">
        <input value={draft} onChange={(event) => setDraft(event.target.value)} aria-label="Message the AI Lab Tutor" placeholder="Ask about your practical..." className="min-w-0 flex-1 rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-sm text-[#263746] outline-none placeholder:text-[#94A3B8] focus:border-[#4F827D]" />
        <button type="submit" disabled={!draft.trim()} className="rounded-lg bg-[#4F827D] px-3 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Send</button>
      </form>
    </section>}
  </>
}

export default LabTutor
