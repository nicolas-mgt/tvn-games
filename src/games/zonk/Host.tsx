import { useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

const TYPE_DELAY_MS = 22

/** Remount with `key={line}` to type a new line from the start. */
export function Host({ line }: { line: string }) {
  const reducedMotion = useReducedMotion()
  const [typed, setTyped] = useState(reducedMotion ? line.length : 0)

  useEffect(() => {
    if (typed >= line.length) return
    const timer = setTimeout(() => setTyped(typed + 1), TYPE_DELAY_MS)
    return () => clearTimeout(timer)
  }, [typed, line.length])

  return (
    <div className="mx-auto flex w-full max-w-2xl items-end gap-3" data-testid="host">
      <div className="flex shrink-0 flex-col items-center gap-1">
        <svg viewBox="0 0 48 48" className="size-12 rounded-full border-2 border-amber-300 bg-indigo-950 p-1.5 shadow-[0_0_18px_#fcd34d66] sm:size-14" aria-hidden>
          <rect x="17" y="5" width="14" height="22" rx="7" fill="#d4d4d8" />
          <path d="M19 10h10M19 14h10M19 18h10" stroke="#71717a" strokeWidth="1.5" />
          <path d="M12 22a12 12 0 0 0 24 0" fill="none" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
          <path d="M24 34v8M17 43h14" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span className="font-display text-xs tracking-widest text-amber-200/80">Prowadzący</span>
      </div>
      <p className="relative mb-5 flex-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 text-sm font-semibold text-indigo-950 shadow-lg shadow-black/40 sm:text-base">
        {line.slice(0, typed)}
        <span className="invisible">{line.slice(typed)}</span>
      </p>
    </div>
  )
}
