const base = {
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function Spinner({ className = 'h-5 w-5' }) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}

export function ChevronLeftIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  )
}

export function ChevronDownIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} {...base}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export function ChatIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M8 10h8M8 14h5M21 12a8.5 8.5 0 01-12.4 7.6L3 21l1.4-5.6A8.5 8.5 0 1121 12z" />
    </svg>
  )
}

export function SendIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} {...base}>
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  )
}

export function UploadIcon({ className = 'h-10 w-10' }) {
  return (
    <svg className={className} {...base} strokeWidth={1.5}>
      <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  )
}

export function CalendarIcon({ className = 'h-4 w-4' }) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="4.5" width="18" height="16.5" rx="2" />
      <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
    </svg>
  )
}

export function BellIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" />
    </svg>
  )
}

export function FileIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  )
}

export function SparklesIcon({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z" />
      <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
    </svg>
  )
}
