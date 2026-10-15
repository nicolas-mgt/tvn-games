import type { CSSProperties } from 'react'
import { JudgeFigure } from './Judge'
import './cottage.css'

export type Mood = 'idle' | 'task' | 'timer' | 'judging' | 'good' | 'bad' | 'result'

const BOOKS = [
  { w: 9, h: 46, c: '#7a2e2e' },
  { w: 12, h: 52, c: '#2f4f6f' },
  { w: 8, h: 40, c: '#c9a227' },
  { w: 11, h: 50, c: '#3e6b48' },
  { w: 7, h: 44, c: '#6b4a8a' },
  { w: 13, h: 48, c: '#a85a32' },
  { w: 9, h: 38, c: '#2d2d2d' },
]

const DUST = Array.from({ length: 18 }, (_, i) => ({
  left: `${3 + ((i * 29) % 15)}%`,
  top: `${30 + ((i * 41) % 45)}%`,
  duration: `${8 + ((i * 5) % 7)}s`,
  delay: `${-((i * 11) % 9)}s`,
}))

const SHELF_BOOKS = BOOKS.map((b, i) => ({ ...b, x: 10 + BOOKS.slice(0, i).reduce((sum, prev) => sum + prev.w + 2, 0) }))

function Bookshelf() {
  return (
    <svg viewBox="0 0 160 260" className="uk-shelf" aria-hidden>
      <rect x="0" y="0" width="160" height="260" fill="#5a3a22" />
      <rect x="6" y="6" width="148" height="248" fill="#3a2414" />
      {[80, 160, 240].map((y) => (
        <rect key={y} x="4" y={y} width="152" height="8" fill="#6e4829" />
      ))}
      {SHELF_BOOKS.map((b) => (
        <rect key={b.x} x={b.x} y={80 - b.h} width={b.w} height={b.h} fill={b.c} />
      ))}
      <g transform="translate(118 46)">
        <ellipse cx="12" cy="22" rx="11" ry="13" fill="#d9a62e" />
        <path d="M4 16 L20 30 M20 16 L4 30 M12 10 V34" stroke="#9a6d12" strokeWidth="1.2" />
        <path d="M12 10 L6 -4 L12 3 L14 -6 L16 3 L22 -3 Z" fill="#3e7d3a" />
      </g>
      <g transform="translate(26 112)">
        <circle cx="20" cy="22" r="20" fill="#3b7bbf" />
        <path d="M8 14 Q16 8 22 16 Q30 22 24 32 Q14 30 8 14 Z M28 6 Q36 10 36 18 Q30 14 28 6 Z" fill="#6aa84f" />
        <path d="M20 42 V48 M10 50 H30" stroke="#c9a227" strokeWidth="3" />
      </g>
      <g transform="translate(96 128)">
        <ellipse cx="20" cy="22" rx="18" ry="10" fill="#ffd43b" />
        <circle cx="30" cy="10" r="9" fill="#ffd43b" />
        <path d="M37 10 L46 12 L37 14 Z" fill="#f08c00" />
        <circle cx="32" cy="8" r="1.6" fill="#222" />
      </g>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={20 + i * 30} y={200 + (i % 2) * 8} width="22" height={40 - (i % 2) * 8} rx="2" fill={['#8a5a3b', '#b0a48a', '#6d6d6d', '#9c3b3b'][i]} />
      ))}
    </svg>
  )
}

export function CottageBackdrop({ mood }: { mood: Mood }) {
  return (
    <div className="uk-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" data-mood={mood} data-testid="cottage-backdrop">
      <div className="uk-wall" />
      <div className="uk-window">
        <div className="uk-window-sky" />
        <div className="uk-window-frame" />
        <div className="uk-curtain uk-curtain-left" />
        <div className="uk-curtain uk-curtain-right" />
      </div>
      <div className="uk-window-light" />
      <div className="uk-portrait">
        <JudgeFigure mood="neutral" className="size-full" />
      </div>
      <svg viewBox="0 0 60 150" className="uk-clock" aria-hidden>
        <rect x="4" y="0" width="52" height="150" rx="8" fill="#5a3a22" stroke="#3a2414" strokeWidth="3" />
        <circle cx="30" cy="30" r="20" fill="#f5ecd7" stroke="#c9a227" strokeWidth="3" />
        <path d="M30 30 V16 M30 30 L40 34" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="14" y="60" width="32" height="82" rx="4" fill="#2b1a0e" />
        <g className="uk-pendulum">
          <path d="M30 60 V120" stroke="#c9a227" strokeWidth="2" />
          <circle cx="30" cy="124" r="8" fill="#e0ad2e" />
        </g>
      </svg>
      <div className="uk-wainscot" />
      <div className="uk-floor">
        <div className="uk-boards" />
      </div>
      <div className="uk-rug" />
      <Bookshelf />
      <svg viewBox="0 0 80 300" className="uk-lamp" aria-hidden>
        <path d="M14 10 H66 L76 60 H4 Z" fill="#e8c784" stroke="#a5813b" strokeWidth="2" />
        <path d="M40 60 V282" stroke="#3a2414" strokeWidth="5" />
        <ellipse cx="40" cy="288" rx="26" ry="8" fill="#3a2414" />
      </svg>
      <div className="uk-lamp-light" />
      {DUST.map((d, i) => (
        <span key={i} className="uk-dust" style={{ left: d.left, top: d.top, animationDelay: d.delay, '--dust-time': d.duration } as CSSProperties} />
      ))}
      <div className="uk-dim" />
      <div className="uk-spot" />
      <div className="uk-tint" />
      <div className="uk-vignette" />
    </div>
  )
}
