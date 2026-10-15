import type { CSSProperties } from 'react'
import './warehouse.css'

export type Mood = 'idle' | 'arrive' | 'open' | 'correct' | 'wrong' | 'result'

const LAMPS = [
  { left: 16, swing: '7s', delay: '0s' },
  { left: 50, swing: '8.5s', delay: '-2s' },
  { left: 84, swing: '6.5s', delay: '-4s' },
]

const DUST = Array.from({ length: 36 }, (_, i) => ({
  left: `${LAMPS[i % 3].left + (((i * 37) % 21) - 10)}%`,
  top: `${18 + ((i * 53) % 55)}%`,
  duration: `${9 + ((i * 7) % 8)}s`,
  delay: `${-((i * 13) % 12)}s`,
}))

const RACKS = Array.from({ length: 5 }, (_, r) => r * 250)
const SHELF_Y = [120, 230, 340, 450]

function rackBoxes(rack: number) {
  return SHELF_Y.flatMap((y, s) => {
    const boxes: { x: number; w: number; h: number; y: number }[] = []
    let x = rack + 14
    for (let i = 0; x < rack + 210; i++) {
      const w = 34 + (((rack + s * 31 + i * 17) * 7) % 40)
      const h = 30 + (((rack + s * 13 + i * 29) * 5) % 50)
      if (x + w > rack + 226) break
      boxes.push({ x, w, h, y: y - h })
      x += w + 6
    }
    return boxes
  })
}

const FAR_BOXES = Array.from({ length: 14 }, (_, i) => ({ x: i * 160 + ((i * 41) % 60), w: 40 + ((i * 17) % 30), h: 30 + ((i * 23) % 26) }))

export function WarehouseBackdrop({ mood }: { mood: Mood }) {
  return (
    <div className="wh-backdrop pointer-events-none fixed inset-0 -z-10 overflow-hidden" data-mood={mood} data-testid="warehouse-backdrop">
      <svg className="wh-racks" viewBox="0 0 1250 470" preserveAspectRatio="xMidYMax slice" aria-hidden>
        {RACKS.map((x) => (
          <g key={x}>
            <rect x={x + 6} y={20} width={8} height={450} />
            <rect x={x + 226} y={20} width={8} height={450} />
            {SHELF_Y.map((y) => (
              <rect key={y} x={x + 6} y={y} width={228} height={7} />
            ))}
            {rackBoxes(x).map((b) => (
              <rect key={`${b.x}-${b.y}`} x={b.x} y={b.y} width={b.w} height={b.h} rx={2} className="wh-rack-box" />
            ))}
          </g>
        ))}
      </svg>
      <div className="wh-far-belt">
        <div className="wh-far-strip">
          {[0, 1].map((copy) => (
            <svg key={copy} viewBox="0 0 2240 60" preserveAspectRatio="none" aria-hidden>
              {FAR_BOXES.map((b) => (
                <rect key={b.x} x={b.x} y={60 - b.h} width={b.w} height={b.h} rx={2} />
              ))}
            </svg>
          ))}
        </div>
      </div>
      <div className="wh-floor" />
      {LAMPS.map((lamp) => (
        <div key={lamp.left} className="wh-lamp" style={{ left: `${lamp.left}%`, '--swing': lamp.swing, '--swing-delay': lamp.delay } as CSSProperties}>
          <div className="wh-cord" />
          <div className="wh-shade" />
          <div className="wh-cone" />
        </div>
      ))}
      {DUST.map((d, i) => (
        <span key={i} className="wh-dust" style={{ left: d.left, top: d.top, '--dust-time': d.duration, animationDelay: d.delay } as CSSProperties} />
      ))}
      <div className="wh-spot" />
      <div className="wh-alert" />
      <div className="wh-vignette" />
    </div>
  )
}
