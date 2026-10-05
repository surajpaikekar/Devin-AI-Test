import { FileIcon } from './icons'

const MATCHES = [
  { name: 'Proposal_NOC_2025_v4.pdf', score: 94, domain: 'NOC', updated: 'Mar 2025' },
  { name: 'Subsea_Layout_Final.docx', score: 87, domain: 'Subsea', updated: 'Nov 2024' },
  { name: 'RAN_Expansion_Project.pptx', score: 79, domain: 'RAN', updated: 'Aug 2024' },
]

const TYPE_STYLES = {
  pdf: 'bg-rose-500/10 text-rose-400',
  docx: 'bg-sky-500/10 text-sky-400',
  pptx: 'bg-amber-500/10 text-amber-400',
}

function scoreColor(score) {
  if (score >= 90) return 'from-emerald-500 to-emerald-400 text-emerald-400'
  if (score >= 80) return 'from-indigo-500 to-violet-400 text-indigo-300'
  return 'from-amber-500 to-amber-400 text-amber-400'
}

export default function MatchedProposals({ domain }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">Top Matched Historical Proposals</h2>
          <p className="text-xs text-slate-400">From the knowledge base</p>
        </div>
        <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400">
          Top 3
        </span>
      </div>

      <ul className="space-y-3">
        {MATCHES.map((m, i) => {
          const ext = m.name.split('.').pop().toLowerCase()
          const colors = scoreColor(m.score)
          const highlighted = domain && domain === m.domain
          return (
            <li
              key={m.name}
              className={`rounded-xl border p-3 transition hover:border-slate-600 hover:bg-slate-800/60 ${
                highlighted ? 'border-indigo-500/60 bg-indigo-500/5' : 'border-slate-800 bg-slate-800/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-2.5 w-4 text-xs font-semibold text-slate-500">{i + 1}</span>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${TYPE_STYLES[ext]}`}>
                  <FileIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="break-all text-sm font-medium leading-snug text-slate-100">{m.name}</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-[11px] text-slate-500">
                      {m.domain} · {m.updated}
                    </p>
                    <span className={`shrink-0 text-xs font-semibold tabular-nums ${colors.split(' ').pop()}`}>
                      {m.score}% Match
                    </span>
                  </div>
                </div>
              </div>
              <div className="ml-[4.75rem] mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${colors.split(' ').slice(0, 2).join(' ')}`}
                  style={{ width: `${m.score}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
