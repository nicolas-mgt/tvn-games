import { motion } from 'motion/react'
import { useEffect, useState, type CSSProperties } from 'react'

const STATIC_MS = 600
const TYPE_MS = 26

/** Mount with a fresh `key` per quote so the channel switch and the typing restart. */
export function Television({ quote, channel, answered, onAir, pace }: { quote: { id: string; text: string }; channel: number; answered: boolean; onAir: boolean; pace: number }) {
  const [typed, setTyped] = useState(0)
  const text = quote.text

  useEffect(() => {
    if (answered) return
    let count = 0
    let timer: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(() => {
      timer = setInterval(() => {
        count++
        setTyped(count)
        if (count >= text.length) clearInterval(timer)
      }, TYPE_MS * pace)
    }, STATIC_MS * pace)
    return () => {
      clearTimeout(start)
      clearInterval(timer)
    }
  }, [answered, text, pace])

  return (
    <div className="kt-tv" data-testid="tv">
      <div className="kt-onair kt-sign" data-testid="on-air" data-on={onAir}>
        On air
      </div>
      <div className="kt-tv-body">
        <div className="kt-screen" style={{ '--kt-hue': (channel * 47) % 360, '--kt-static-ms': `${STATIC_MS * pace}ms` } as CSSProperties}>
          <div className="kt-show" aria-hidden="true">
            <span className="kt-show-logo kt-sign">TV{channel}</span>
          </div>
          <span className="kt-channel kt-sign">Kanał {channel}</span>
          <p className="kt-subtitle" data-testid="quote" data-id={quote.id}>
            „{answered ? text : text.slice(0, typed)}
            {answered || typed >= text.length ? '”' : <span className="kt-caret">▌</span>}
          </p>
          <div className="kt-static" aria-hidden="true" />
          <div className="kt-glass" aria-hidden="true" />
        </div>
        <div className="kt-tv-side" aria-hidden="true">
          <span className="kt-knob" />
          <span className="kt-knob" />
          <span className="kt-grille" />
        </div>
      </div>
      <div className="kt-tv-legs" aria-hidden="true" />
    </div>
  )
}

export function Verdict({ correct, speaker, reaction, last, pace, onNext }: { correct: boolean; speaker: string; reaction: string; last: boolean; pace: number; onNext: () => void }) {
  return (
    <motion.section className="kt-verdict" data-testid="verdict" data-correct={correct} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 * pace }}>
      <p className="kt-verdict-title kt-sign">{correct ? 'Trafione!' : 'Pudło!'}</p>
      <p>
        To powiedział(a): <b>{speaker}</b>
      </p>
      <p className="kt-reaction">„{reaction}”</p>
      <button type="button" className="kt-next kt-sign" onClick={onNext} data-testid="next">
        {last ? 'Podsumowanie' : 'Następny kanał'}
      </button>
    </motion.section>
  )
}
