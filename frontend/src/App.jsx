import { useRef, useState } from 'react'

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

function Spinner() {
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

export default function App() {
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
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
            PB
          </div>
          <div>
            <h1 className="text-lg font-semibold">Proposal Builder</h1>
            <p className="text-sm text-slate-500">Upload an RFP to get a summary and key requirements</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-6 py-8">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
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
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-12 text-center transition ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
            } ${loading ? 'pointer-events-none opacity-60' : ''}`}
          >
            <svg className="mb-3 h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="font-medium">
              Drag &amp; drop your RFP here, or <span className="text-indigo-600 underline">browse</span>
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
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 px-4 py-3">
              <div className="min-w-0">
                <p className="truncate font-medium">{file.name}</p>
                <p className="text-sm text-slate-500">{formatSize(file.size)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={reset}
                  disabled={loading}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-white disabled:opacity-50"
                >
                  Clear
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-70"
                >
                  {loading && <Spinner />}
                  {loading ? 'Analyzing…' : 'Analyze RFP'}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}
        </section>

        {loading && (
          <section className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
            <Spinner />
            <span>Extracting text and analyzing the RFP with Gemini. This can take up to a minute…</span>
          </section>
        )}

        {result && (
          <>
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-base font-semibold text-slate-900">Summary</h2>
              <p className="whitespace-pre-line leading-relaxed text-slate-700">{result.summary}</p>
            </section>
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-base font-semibold text-slate-900">
                Key Requirements <span className="font-normal text-slate-500">({result.requirements.length})</span>
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-slate-700 marker:text-indigo-500">
                {result.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
