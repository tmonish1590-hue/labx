'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sparkles, X } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

type TutorMessage = { id: number; role: 'assistant' | 'user'; text: string }
type ExperimentContext = { name: string; subject: string; prompt: string }

const contexts: Record<string, ExperimentContext> = {
  'iodine-clock': { name: 'Iodine Clock Reaction', subject: 'Chemistry', prompt: 'Ask about reaction rates, colour change, timing, or temperature.' },
  'fehlings-test': { name: "Fehling's Test", subject: 'Chemistry', prompt: 'Ask about reducing sugars, reagent setup, heating, or precipitates.' },
  'simple-pendulum': { name: 'Simple Pendulum', subject: 'Physics', prompt: 'Ask about period, length, timing trials, or the pendulum relationship.' },
  'ohms-law': { name: "Ohm's Law Circuit", subject: 'Physics', prompt: 'Ask about voltage, current, resistance, meters, or circuit setup.' },
}

export function LabTutor() {
  const pathname = usePathname()
  const { language, t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<TutorMessage[]>([])
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const context = useMemo(() => Object.entries(contexts).find(([route]) => pathname.includes(route))?.[1], [pathname])
  const suggestions = language === 'te' ? ['నా సెటప్‌లో ఏమి తనిఖీ చేయాలి?', 'సిద్ధాంతాన్ని సులభంగా వివరించగలరా?', 'నా రీడింగ్స్‌ను ఎలా అర్థం చేసుకోవాలి?'] : language === 'hi' ? ['सेटअप में क्या जांचूं?', 'सिद्धांत सरलता से समझाएं।', 'रीडिंग को कैसे समझूं?'] : ['What should I check in my setup?', 'Can you explain the theory simply?', 'How should I interpret my readings?']

  function openTutor() { setOpen(true); if (messages.length === 0) setMessages([{ id: 1, role: 'assistant', text: context ? `${context.name}. ${context.prompt}` : t('tutorReady') }]) }
  useEffect(() => {
    if (!open) { triggerRef.current?.focus(); return }
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); return }
      if (event.key !== 'Tab') return
      const dialog = event.currentTarget as Document
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('[role="dialog"] button, [role="dialog"] input')).filter((element) => !element.hasAttribute('disabled'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])
  async function send(text = draft) {
    const value = text.trim(); if (!value || loading || value.length > 1200) return
    setMessages((current) => [...current, { id: Date.now(), role: 'user', text: value }]); setDraft(''); setLoading(true)
    try {
      const response = await fetch('/api/tutor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: value, language, experiment: context?.name }) })
      const data = await response.json() as { answer?: string; error?: string }
      setMessages((current) => [...current, { id: Date.now() + 1, role: 'assistant', text: data.answer ?? data.error ?? t('tutorUnavailable') }])
    } catch { setMessages((current) => [...current, { id: Date.now() + 1, role: 'assistant', text: t('tutorUnavailable') }]) } finally { setLoading(false) }
  }

  return <>
    <button ref={triggerRef} type="button" aria-label={t('tutor')} aria-haspopup="dialog" aria-expanded={open} onClick={openTutor} className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#4F827D] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#263746]/20 transition hover:bg-[#263746] focus:outline-none focus:ring-2 focus:ring-[#4F827D] focus:ring-offset-2 sm:bottom-6 sm:right-6"><Sparkles className="size-4" />{t('tutor')}</button>
    {open && <section role="dialog" aria-modal="true" aria-label={t('tutor')} className="fixed inset-x-3 bottom-3 z-50 flex max-h-[min(680px,calc(100vh-1.5rem))] flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[390px]">
      <header className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F5F7FA] px-4 py-3"><div><h2 className="text-sm font-semibold text-[#263746]">{t('tutor')}</h2><p className="text-xs text-[#64748B]">{context ? `${context.subject} · ${context.name}` : t('labSupport')}</p></div><button ref={closeRef} type="button" aria-label={t('close')} onClick={() => setOpen(false)} className="rounded-md p-1.5 text-[#64748B] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#4F827D]"><X className="size-4" /></button></header>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4" role="log" aria-live="polite" aria-relevant="additions" aria-busy={loading}>{messages.map((message) => <div key={message.id} className={`max-w-[88%] rounded-xl px-3 py-2.5 text-sm leading-5 ${message.role === 'user' ? 'ml-auto bg-[#4F827D] text-white' : 'bg-[#F5F7FA] text-[#263746]'}`}><span className="sr-only">{message.role === 'user' ? 'You: ' : 'Tutor: '}</span>{message.text}</div>)}{loading && <div className="text-xs text-[#64748B]" role="status">{language === 'te' ? 'సమాధానం సిద్ధమవుతోంది...' : language === 'hi' ? 'उत्तर तैयार हो रहा है...' : t('tutorThinking')}</div>}<div className="flex flex-wrap gap-2">{suggestions.map((question) => <button key={question} type="button" disabled={loading} onClick={() => send(question)} className="rounded-full border border-[#DCE8E5] px-3 py-1.5 text-left text-xs text-[#4F827D] hover:bg-[#F0F6F5]">{question}</button>)}</div></div>
      <form onSubmit={(event) => { event.preventDefault(); void send() }} className="flex gap-2 border-t border-[#E2E8F0] p-3"><input value={draft} maxLength={1200} onChange={(event) => setDraft(event.target.value)} aria-label={t('askTutor')} placeholder={t('askTutor')} className="min-w-0 flex-1 rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-sm text-[#263746] outline-none placeholder:text-[#94A3B8] focus:border-[#4F827D]" /><button type="submit" disabled={!draft.trim() || loading} className="rounded-lg bg-[#4F827D] px-3 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">{t('send')}</button></form>
    </section>}
  </>
}

export default LabTutor
