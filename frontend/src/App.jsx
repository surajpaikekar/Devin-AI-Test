import { useRef, useState } from 'react'
import ChatSidebar from './components/ChatSidebar'
import DashboardHeader from './components/DashboardHeader'
import DomainSelector from './components/DomainSelector'
import MatchedProposals from './components/MatchedProposals'
import { FileIcon, SparklesIcon, Spinner, UploadIcon } from './components/icons'

const API_BASE = import.meta.env.VITE_API_URL ?? ''
const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.pptx']
const ACCEPT_ATTR = ACCEPTED_EXTENSIONS.join(',')

function getExtension(name) {
  const idx = name.lastIndexOf('.')
  return idx === -1 ? '' : name.slice(idx).toLowerCase()
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const card = 'rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [domain, setDomain] = useState('')
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const inputRef = useRef(null)

  function selectFile(selected) {
    if (!selected) return
    if (!ACCEPTED_EXTENSIONS.includes(getExtension(selected.name))) {
      setError('Unsupported file type. Please choose a PDF, DOCX, or PPTX file.')
      setFile(null)
      return
    }
    setError('')
    setResult(null)
    setFile(selected)
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    if (loading) return
    selectFile(e.dataTransfer.files?.[0])
  }

  async function handleAnalyze() {
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.detail || `Request failed (${res.status})`)
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setFile(null)
    setResult(null)
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-200 antialiased">
      <ChatSidebar open={sidebarOpen} onToggle={() => setSidebarOpen((o) => !o)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,rgba(79,70,229,0.12),transparent_55%)]">
          <div className="mx-auto grid max-w-7xl gap-6 p-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
              <section className={card}>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-100">Upload RFP</h2>
                    <p className="text-xs text-slate-400">PDF, DOCX or PPTX, up to 25 MB</p>
                  </div>
                  {domain && (
                    <span className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-medium text-indigo-300">
                      {domain}
                    </span>
                  )}
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => !loading && inputRef.current?.click()}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !loading && inputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault()
                    if (!loading) setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-slate-700 bg-slate-950/40 hover:border-indigo-500/70 hover:bg-slate-800/40'
                  } ${loading ? 'pointer-events-none opacity-60' : ''}`}
                >
                  <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                    <UploadIcon className="h-7 w-7" />
                  </span>
                  <p className="font-medium text-slate-200">
                    Drag &amp; drop your RFP here, or <span className="text-indigo-400 underline">browse</span>
                  </p>
                  <p className="mt-1 text-sm text-slate-500">Supported formats: PDF, DOCX, PPTX</p>
                  <input
                    ref={inputRef}
                    type="file"
                    accept={ACCEPT_ATTR}
                    className="hidden"
                    onChange={(e) => selectFile(e.target.files?.[0])}
                  />
                </div>

                {file && (
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-800/50 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-700/60 text-slate-300">
                        <FileIcon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-100">{file.name}</p>
                        <p className="text-sm text-slate-400">{formatSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={reset}
                        disabled={loading}
                        className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleAnalyze}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500 disabled:opacity-70"
                      >
                        {loading && <Spinner />}
                        {loading ? 'Analyzing…' : 'Analyze RFP'}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}
              </section>

              {loading && (
                <section className={`${card} flex items-center gap-3 text-slate-300`}>
                  <Spinner className="h-5 w-5 text-indigo-400" />
                  <span>Extracting text and analyzing the RFP with Gemini. This can take up to a minute…</span>
                </section>
              )}

              {result && (
                <>
                  <section className={card}>
                    <div className="mb-3 flex items-center gap-2">
                      <SparklesIcon className="h-4 w-4 text-indigo-400" />
                      <h2 className="text-sm font-semibold text-slate-100">Summary</h2>
                      <span className="ml-auto truncate text-xs text-slate-500">{result.filename}</span>
                    </div>
                    <p className="whitespace-pre-line leading-relaxed text-slate-300">{result.summary}</p>
                  </section>
                  <section className={card}>
                    <h2 className="mb-3 text-sm font-semibold text-slate-100">
                      Key Requirements{' '}
                      <span className="font-normal text-slate-500">({result.requirements.length})</span>
                    </h2>
                    <ul className="space-y-2">
                      {result.requirements.map((req, i) => (
                        <li
                          key={i}
                          className="flex gap-3 rounded-lg border border-slate-800 bg-slate-800/30 px-3 py-2.5 text-slate-300"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </>
              )}
            </div>

            <div className="space-y-6">
              <DomainSelector value={domain} onChange={setDomain} disabled={loading} />
              <MatchedProposals domain={domain} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
