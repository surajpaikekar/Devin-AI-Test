import { useEffect, useRef, useState } from 'react'
import { ChatIcon, ChevronLeftIcon, SendIcon, SparklesIcon } from './icons'

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'assistant',
    text: "Hi Suraj! I'm your proposal assistant. Upload an RFP and I'll help you summarize it and map requirements to past wins.",
    time: '09:12',
  },
  {
    id: 2,
    role: 'user',
    text: 'We have a new NOC managed-services RFP due next month. Can you find similar proposals we submitted?',
    time: '09:14',
  },
  {
    id: 3,
    role: 'assistant',
    text: 'Sure. Proposal_NOC_2025_v4.pdf is a 94% match. It covers 24/7 monitoring SLAs and an escalation matrix you can reuse.',
    time: '09:14',
  },
]

const MOCK_REPLY =
  "Thanks! This is a demo chat, so I can't answer yet. Soon I'll use your uploaded RFP and the knowledge base to respond."

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
}

export default function ChatSidebar({ open, onToggle }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)
  const replyTimer = useRef(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => () => clearTimeout(replyTimer.current), [])

  function handleSend(e) {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text, time: formatTime(new Date()) }])
    setDraft('')
    setTyping(true)
    clearTimeout(replyTimer.current)
    replyTimer.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', text: MOCK_REPLY, time: formatTime(new Date()) },
      ])
      setTyping(false)
    }, 900)
  }

  return (
    <aside
      className={`relative flex shrink-0 flex-col border-r border-slate-800 bg-slate-900/80 backdrop-blur transition-[width] duration-300 ease-in-out ${
        open ? 'w-80' : 'w-16'
      }`}
    >
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-900/40">
          PB
        </div>
        <div
          className={`min-w-0 overflow-hidden whitespace-nowrap transition-opacity duration-200 ${
            open ? 'opacity-100' : 'pointer-events-none w-0 opacity-0'
          }`}
        >
          <p className="text-sm font-semibold text-slate-100">Proposal Builder</p>
          <p className="text-xs text-slate-400">Bid Intelligence Suite</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'}
        aria-expanded={open}
        className="absolute -right-3 top-5 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 shadow-md transition hover:bg-indigo-600 hover:text-white"
      >
        <ChevronLeftIcon className={`h-4 w-4 transition-transform duration-300 ${open ? '' : 'rotate-180'}`} />
      </button>

      {open ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between px-4 pb-2 pt-5">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
              <ChatIcon className="h-4 w-4 text-indigo-400" />
              Chat Session
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Online
            </span>
          </div>

          <div ref={listRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
                    m.role === 'user'
                      ? 'bg-slate-700 text-slate-200'
                      : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
                  }`}
                >
                  {m.role === 'user' ? 'SP' : <SparklesIcon className="h-3.5 w-3.5" />}
                </div>
                <div className={`max-w-[78%] ${m.role === 'user' ? 'items-end text-right' : ''} flex flex-col`}>
                  <div
                    className={`rounded-2xl px-3 py-2 text-left text-[13px] leading-relaxed ${
                      m.role === 'user'
                        ? 'rounded-tr-sm bg-indigo-600 text-white'
                        : 'rounded-tl-sm border border-slate-700/70 bg-slate-800 text-slate-200'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="mt-1 text-[10px] text-slate-500">{m.time}</span>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                  <SparklesIcon className="h-3.5 w-3.5" />
                </div>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-slate-800 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask the proposal assistant…"
                aria-label="Chat message"
                className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label="Send message"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <SendIcon />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={onToggle}
          aria-label="Open chat session"
          className="mx-auto mt-5 flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-indigo-400"
        >
          <ChatIcon />
        </button>
      )}
    </aside>
  )
}
