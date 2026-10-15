import type { CSSProperties } from 'react'
import './studio.css'

export type Mood = 'idle' | 'pick' | 'tension' | 'prize' | 'zonk' | 'cash' | 'result'

const ARCH_BULBS = Array.from({ length: 31 }, (_, i) => {
  const angle = Math.PI * (i / 30)
  return { x: 500 - Math.cos(angle) * 470, y: 470 - Math.sin(angle) * 400 }
})

const SPARKLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${4 + ((i * 41) % 92)}%`,
  top: `${60 + ((i * 17) % 9)}%`,
  delay: `${-((i * 7) % 11) / 4}s`,
}))

export function StudioBackdrop({ mood }: { mood: Mood }) {
  return (
    <>
      <div className="zk-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" data-mood={mood} data-testid="studio-backdrop">
        <div className="zk-tinsel zk-tinsel-left" />
        <div className="zk-tinsel zk-tinsel-right" />
        <svg className="zk-arch" viewBox="0 0 1000 480" aria-hidden>
          <path d="M 50 470 A 450 380 0 0 1 950 470" className="zk-arch-neon" />
          {ARCH_BULBS.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r={7} className="zk-bulb" style={{ '--i': i, '--n': ARCH_BULBS.length } as CSSProperties} />
          ))}
        </svg>
        <div className="zk-floor">
          <div className="zk-grid" />
        </div>
        {SPARKLES.map((s, i) => (
          <span key={i} className="zk-sparkle" style={{ left: s.left, top: s.top, animationDelay: s.delay }} />
        ))}
        <div className="zk-beam zk-beam-left" />
        <div className="zk-beam zk-beam-right" />
        <div className="zk-dim" />
        <div className="zk-flash" />
      </div>
      <div className="zk-vhs pointer-events-none fixed inset-0 z-40" aria-hidden>
        <span className="zk-osd zk-osd-left">PLAY ▶</span>
        <span className="zk-osd zk-osd-right">SP 19.10.1997</span>
      </div>
    </>
  )
}
