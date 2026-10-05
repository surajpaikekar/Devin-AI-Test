import { useEffect, useState } from 'react'
import { BellIcon, CalendarIcon, ChevronDownIcon } from './icons'

const USER = { name: 'Suraj Paikekar', role: 'Bid Manager' }

function initials(name) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

export default function DashboardHeader() {
  const now = useNow()
  const date = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const time = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/60 px-6 backdrop-blur">
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-slate-100">RFP Analysis Dashboard</h1>
        <p className="truncate text-xs text-slate-400">Upload an RFP to generate a summary and key requirements</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 md:flex">
          <CalendarIcon className="h-4 w-4 text-indigo-400" />
          <span className="text-sm text-slate-300">{date}</span>
          <span className="h-4 w-px bg-slate-700" />
          <time className="font-mono text-sm tabular-nums text-slate-100" dateTime={now.toISOString()}>
            {time}
          </time>
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition hover:text-slate-100"
        >
          <BellIcon className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-slate-900" />
        </button>

        <button
          type="button"
          className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 py-1 pl-1 pr-3 transition hover:border-slate-700"
        >
          <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-semibold text-white">
            {initials(USER.name)}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-medium leading-tight text-slate-100">{USER.name}</span>
            <span className="block text-[11px] leading-tight text-slate-400">{USER.role}</span>
          </span>
          <ChevronDownIcon className="hidden h-4 w-4 text-slate-500 sm:block" />
        </button>
      </div>
    </header>
  )
}
