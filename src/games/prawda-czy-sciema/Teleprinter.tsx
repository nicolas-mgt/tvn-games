import { motion, useMotionValue, useMotionValueEvent, useTransform, type PanInfo } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type headlines from './data.json'
import { SWIPE_THRESHOLD } from './logic'
import { play } from './sfx'

type Headline = (typeof headlines)[number]
export type Lean = 'true' | 'false' | null

const TYPE_MS = 28
const STRIKES_PER_SOUND = 5

/** Mount with a fresh `key` per headline so the typing restarts. */
export function Teleprinter({
  headline,
  number,
  total,
  saysReal,
  last,
  pace,
  onAnswer,
  onLean,
  onNext,
}: {
  headline: Headline
  number: number
  total: number
  saysReal: boolean | null
  last: boolean
  pace: number
  onAnswer: (saysReal: boolean) => void
  onLean: (lean: Lean) => void
  onNext: () => void
}) {
  const answered = saysReal !== null
  const correct = answered && saysReal === headline.real
  const [typed, setTyped] = useState(0)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-240, 240], [-9, 9])
  const trueStamp = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1])
  const falseStamp = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0])
  const lean = useRef<Lean>(null)
  const text = headline.headline

  useEffect(() => {
    if (answered) return
    let count = 0
    const timer = setInterval(() => {
      if (count % STRIKES_PER_SOUND === 0) play('teletype', STRIKES_PER_SOUND)
      count++
      setTyped(count)
      if (count >= text.length) clearInterval(timer)
    }, TYPE_MS * pace)
    return () => clearInterval(timer)
  }, [answered, text, pace])

  useMotionValueEvent(x, 'change', (offset) => {
    if (answered) return
    const next: Lean = offset > SWIPE_THRESHOLD / 2 ? 'true' : offset < -SWIPE_THRESHOLD / 2 ? 'false' : null
    if (next !== lean.current) {
      lean.current = next
      onLean(next)
    }
  })

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD) onAnswer(true)
    else if (info.offset.x < -SWIPE_THRESHOLD) onAnswer(false)
  }

  const direction = saysReal ? 1 : -1
  return (
    <div className="ps-teleprinter">
      <div className="ps-machine" aria-hidden="true">
        <span className="ps-sign">Teledepesza</span>
        <span className="ps-machine-lamp" data-on={!answered && typed < text.length} />
        <div className="ps-machine-slot" />
      </div>

      <div className="ps-feed">
        <motion.article
          className="ps-paper"
          data-testid="headline"
          data-id={headline.id}
          drag={answered ? false : 'x'}
          dragSnapToOrigin
          dragElastic={0.6}
          onDragEnd={onDragEnd}
          style={{ x, rotate, pointerEvents: answered ? 'none' : undefined }}
          initial={{ y: -60, opacity: 0 }}
          animate={answered ? { x: direction * 900, rotate: direction * 24, opacity: 0, transition: { delay: 0.5 * pace, duration: 0.5 * pace, ease: 'easeIn' } } : { y: 0, opacity: 1 }}
          whileDrag={{ cursor: 'grabbing' }}
        >
          <p className="ps-paper-meta">
            Depesza {number}/{total} · pilne
          </p>
          <p className="ps-paper-text">
            {answered ? text : text.slice(0, typed)}
            {!answered && typed < text.length && <span className="ps-caret">▌</span>}
          </p>
          {!answered && (
            <>
              <motion.span className="ps-stamp ps-stamp-true ps-sign" data-kind="true" style={{ opacity: trueStamp }}>
                Prawda
              </motion.span>
              <motion.span className="ps-stamp ps-stamp-false ps-sign" data-kind="false" style={{ opacity: falseStamp }}>
                Ściema
              </motion.span>
            </>
          )}
          {answered && (
            <motion.span
              className="ps-stamp ps-stamp-final ps-sign"
              data-kind={String(saysReal)}
              initial={{ scale: 2.6, opacity: 0, rotate: -14 }}
              animate={{ scale: 1, opacity: 1, rotate: -10 }}
              transition={{ type: 'spring', stiffness: 600, damping: 18 }}
            >
              {saysReal ? 'Prawda' : 'Ściema'}
            </motion.span>
          )}
        </motion.article>

        {answered && (
          <motion.section
            className="ps-explanation"
            data-testid="explanation"
            data-correct={correct}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 * pace }}
          >
            <p className="ps-verdict ps-sign">
              {headline.real ? 'Prawda' : 'Ściema'} · {correct ? 'trafione' : 'pudło'}
            </p>
            <p className="ps-explanation-headline">„{text}”</p>
            <p>{headline.explanation}</p>
            <div className="ps-explanation-row">
              {headline.source ? (
                <a href={headline.source} target="_blank" rel="noreferrer" className="ps-source" data-testid="source">
                  Źródło: Wikipedia
                </a>
              ) : (
                <span className="ps-source-none">Zmyślone przez redakcję</span>
              )}
              <button type="button" className="ps-next ps-sign" onClick={onNext} data-testid="next">
                {last ? 'Podsumowanie' : 'Dalej'}
              </button>
            </div>
          </motion.section>
        )}
      </div>

      {!answered && (
        <div className="ps-answers">
          <button type="button" className="ps-answer ps-sign" data-kind="false" onClick={() => onAnswer(false)} data-testid="answer-false">
            ← Ściema
          </button>
          <button type="button" className="ps-answer ps-sign" data-kind="true" onClick={() => onAnswer(true)} data-testid="answer-true">
            Prawda →
          </button>
        </div>
      )}
    </div>
  )
}
