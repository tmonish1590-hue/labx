'use client'

import { useState } from 'react'
import {
  Award,
  Beaker,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FlaskConical,
  FolderOpen,
  Home,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Play,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  X,
  Zap,
} from 'lucide-react'

const experiments = {
  Chemistry: [
    {
      title: 'Iodine Clock Reaction',
      description: 'Investigate reaction rates by timing the sudden colour change between iodine and starch.',
      difficulty: 'Intermediate',
      duration: '25 min',
      status: 'Continue lab',
      image: '/iodine-clock.png',
      tint: 'bg-[#F4EDE3]',
    },
    {
      title: "Fehling's Test",
      description: 'Identify reducing sugars by observing the characteristic precipitate after gentle heating.',
      difficulty: 'Beginner',
      duration: '20 min',
      status: 'Start experiment',
      image: '/fehlings-test.png',
      tint: 'bg-[#EAF1EF]',
    },
  ],
  Physics: [
    {
      title: 'Simple Pendulum',
      description: 'Measure the period of a pendulum and explore how length affects its motion.',
      difficulty: 'Beginner',
      duration: '30 min',
      status: 'Start experiment',
      image: '/simple-pendulum.png',
      tint: 'bg-[#EEF1F3]',
    },
    {
      title: "Ohm's Law Circuit",
      description: 'Build a simple circuit and verify the relationship between voltage, current and resistance.',
      difficulty: 'Intermediate',
      duration: '35 min',
      status: 'Start experiment',
      image: '/ohms-law.png',
      tint: 'bg-[#E9F0EF]',
    },
  ],
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const links = [
    { label: 'Dashboard', icon: LayoutDashboard, active: true },
    { label: 'Virtual Lab', icon: FlaskConical },
    { label: 'My Courses', icon: BookOpen },
    { label: 'Achievements', icon: Award },
  ]
  return (
    <>
      {open && <button aria-label="Close navigation" onClick={onClose} className="fixed inset-0 z-20 bg-slate-900/20 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-[#E2E8F0] bg-white px-5 py-6 transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-11 flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5"><span className="flex size-9 items-center justify-center rounded-xl bg-[#DCE8E5] text-[#4F827D]"><Beaker /></span><span className="text-lg font-bold tracking-tight text-[#263746]">LabX <span className="font-normal text-[#4F827D]">AI</span></span></div>
          <button aria-label="Close navigation" onClick={onClose} className="text-slate-400 lg:hidden"><X /></button>
        </div>
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">Workspace</p>
        <nav className="flex flex-col gap-1.5">
          {links.map(({ label, icon: Icon, active }) => <a key={label} href="#" className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${active ? 'bg-[#DCE8E5] text-[#263746]' : 'text-[#64748B] hover:bg-slate-50'}`}><Icon className="size-[18px]" />{label}</a>)}
        </nav>
        <p className="mb-3 mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#94A3B8]">Account</p>
        <nav className="flex flex-col gap-1.5"><a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#64748B] hover:bg-slate-50"><Settings className="size-[18px]" />Settings</a></nav>
        <div className="mt-auto rounded-xl border border-[#E2E8F0] bg-[#F5F7FA] p-4"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#263746]"><ShieldCheck className="size-4 text-[#4F827D]" />Storage secure</div><p className="text-xs leading-5 text-[#64748B]">Your lab data is encrypted and backed up.</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#DCE8E5]"><div className="h-full w-[68%] rounded-full bg-[#4F827D]" /></div><p className="mt-2 text-[11px] text-[#94A3B8]">2.4 GB of 5 GB used</p></div>
      </aside>
    </>
  )
}

function ExperimentCard({ experiment }: { experiment: (typeof experiments.Chemistry)[number] }) {
  return <article className="group overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_2px_10px_rgba(38,55,70,0.04)] transition-shadow hover:shadow-[0_8px_24px_rgba(38,55,70,0.09)]"><div className={`relative h-40 overflow-hidden ${experiment.tint}`}><img src={experiment.image} alt={`${experiment.title} apparatus`} className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" /><div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#4F827D] shadow-sm">{experiment.status === 'Continue lab' ? 'In progress' : 'Not started'}</div></div><div className="p-5"><div className="flex items-start justify-between gap-3"><h3 className="text-base font-semibold text-[#263746]">{experiment.title}</h3><button aria-label={`More options for ${experiment.title}`} className="text-slate-400 hover:text-[#263746]"><MoreHorizontal className="size-5" /></button></div><p className="mt-2 min-h-10 text-sm leading-5 text-[#64748B]">{experiment.description}</p><div className="mt-4 flex items-center gap-4 text-xs text-[#64748B]"><span className="flex items-center gap-1.5"><Target className="size-3.5 text-[#4F827D]" />{experiment.difficulty}</span><span className="flex items-center gap-1.5"><Clock3 className="size-3.5 text-[#4F827D]" />{experiment.duration}</span></div><button className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#263746] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#4F827D]">{experiment.status}<ChevronRight className="size-4" /></button></div></article>
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  return <main className="min-h-screen bg-[#F5F7FA] text-[#263746] lg:flex"><Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} /><section className="min-w-0 flex-1"><header className="flex h-[72px] items-center justify-between border-b border-[#E2E8F0] bg-white px-5 sm:px-8"><div className="flex items-center gap-3"><button aria-label="Open navigation" onClick={() => setMenuOpen(true)} className="text-[#64748B] lg:hidden"><Menu /></button><div><p className="text-xs text-[#94A3B8]">Workspace / Virtual Lab</p><h1 className="text-lg font-semibold text-[#263746]">Virtual Lab</h1></div></div><div className="flex items-center gap-3 sm:gap-5"><div className="hidden items-center gap-2 rounded-full bg-[#F5F7FA] px-3 py-2 text-xs font-medium text-[#64748B] sm:flex"><Zap className="size-4 text-[#4F827D]" /> 1,240 XP</div><div className="flex size-9 items-center justify-center rounded-full bg-[#DCE8E5] text-sm font-bold text-[#263746]">AK</div></div></header><div className="mx-auto max-w-7xl p-5 sm:p-8"><div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 flex items-center gap-2 text-sm font-medium text-[#4F827D]"><Sparkles className="size-4" />Good afternoon, Alex</p><h2 className="text-2xl font-bold tracking-tight text-[#263746] sm:text-3xl">Explore your virtual lab</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[#64748B]">Run guided experiments, practise safely, and build confidence before exam day.</p></div><div className="flex items-center gap-3 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 shadow-sm"><div className="flex size-9 items-center justify-center rounded-lg bg-[#DCE8E5] text-[#4F827D]"><Award className="size-5" /></div><div><p className="text-[11px] text-[#64748B]">Exam readiness</p><p className="text-sm font-bold text-[#263746]">78% <span className="font-normal text-[#4F827D]">· On track</span></p></div></div></div><div className="mb-9 grid gap-4 sm:grid-cols-3"><div className="rounded-xl border border-[#E2E8F0] bg-white p-4"><div className="flex items-center justify-between"><span className="text-xs text-[#64748B]">Labs completed</span><CheckCircle2 className="size-4 text-[#4F827D]" /></div><p className="mt-2 text-2xl font-bold">12 <span className="text-sm font-normal text-[#94A3B8]">/ 20</span></p><div className="mt-3 h-1.5 rounded-full bg-[#DCE8E5]"><div className="h-full w-[60%] rounded-full bg-[#4F827D]" /></div></div><div className="rounded-xl border border-[#E2E8F0] bg-white p-4"><div className="flex items-center justify-between"><span className="text-xs text-[#64748B]">Current streak</span><Zap className="size-4 text-[#4F827D]" /></div><p className="mt-2 text-2xl font-bold">6 <span className="text-sm font-normal text-[#94A3B8]">days</span></p><p className="mt-3 text-xs text-[#4F827D]">Keep it going</p></div><div className="rounded-xl border border-[#E2E8F0] bg-white p-4"><div className="flex items-center justify-between"><span className="text-xs text-[#64748B]">Lab accuracy</span><Home className="size-4 text-[#4F827D]" /></div><p className="mt-2 text-2xl font-bold">92<span className="text-sm font-normal text-[#94A3B8]">%</span></p><p className="mt-3 text-xs text-[#4F827D]">Above your target</p></div></div><div className="flex flex-col gap-9">{Object.entries(experiments).map(([section, items]) => <section key={section}><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-bold text-[#263746]">{section}</h2><p className="mt-1 text-xs text-[#64748B]">{section === 'Chemistry' ? 'Observe, measure and understand chemical reactions.' : 'Build intuition through measurement and motion.'}</p></div><button className="hidden items-center gap-1 text-xs font-semibold text-[#4F827D] sm:flex">View all <ChevronRight className="size-4" /></button></div><div className="grid gap-5 md:grid-cols-2">{items.map((experiment) => <ExperimentCard key={experiment.title} experiment={experiment} />)}</div></section>)}</div></div></section></main>
}
