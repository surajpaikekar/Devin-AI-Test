import { ChevronDownIcon } from './icons'

const RFP_DOMAINS = ['NOC', 'Subsea', 'RAN', 'Core Network']

export default function DomainSelector({ value, onChange, disabled }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg shadow-black/20">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-100">RFP Metadata</h2>
        <p className="text-xs text-slate-400">Tag the opportunity before analysis</p>
      </div>
      <label htmlFor="rfp-domain" className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
        RFP Domain
      </label>
      <div className="relative">
        <select
          id="rfp-domain"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 pr-10 text-sm text-slate-100 transition hover:border-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <option value="">Select a domain…</option>
          {RFP_DOMAINS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </div>
    </section>
  )
}
