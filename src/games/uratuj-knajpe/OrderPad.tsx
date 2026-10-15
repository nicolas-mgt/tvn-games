import { AnimatePresence, motion } from 'motion/react'
import { Chef, Owner } from './Cast'
import { Delta } from './Gauges'
import { chefMood, OWNER_NAMES, ownerMood, STAT_KEYS, type ChefMood, type Choice, type Ending, type Scene } from './logic'

type OrderPadProps = {
  scene: Scene
  day: number
  intro?: string
  picked: Choice | null
  /** Milliseconds before the first "+1" chip flies to the bar. */
  deltaDelay: number
  nextLabel: string
  onPick: (choice: Choice) => void
  onNext: () => void
}

export function OrderPad({ scene, day, intro, picked, deltaDelay, nextLabel, onPick, onNext }: OrderPadProps) {
  const mood = chefMood(picked)
  const cards = picked ? [picked] : scene.choices
  return (
    <section className="kn-stage">
      <div className="kn-host">
        <Chef mood={mood} className="kn-chef" />
        <div className="kn-bubble">
          {intro && <p className="kn-intro">{intro}</p>}
          <h2 className="kn-scene-title">{scene.title}</h2>
          <p>{scene.text}</p>
        </div>
        <div className="kn-owners">
          {scene.cast.map((who) => (
            <figure key={who}>
              <Owner who={who} mood={picked ? ownerMood(picked) : 'neutral'} />
              <figcaption>{OWNER_NAMES[who]}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="kn-pad">
        <div className="kn-pad-top">
          <span>Zamówienie nr {day}</span>
        </div>
        <AnimatePresence mode="popLayout">
          {cards.map((choice, i) => (
            <motion.button
              key={choice.text}
              layout
              type="button"
              className="kn-ticket"
              data-testid="choice"
              disabled={picked !== null}
              onClick={() => onPick(choice)}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0, transition: { delay: picked ? 0 : 0.15 + i * 0.12 } }}
              exit={{ opacity: 0, y: -90, rotate: i % 2 ? 14 : -14, transition: { duration: 0.45 } }}
            >
              <span className="kn-hand">{choice.text}</span>
              {picked && (
                <motion.span className="kn-served" initial={{ scale: 2.4, rotate: -24, opacity: 0 }} animate={{ scale: 1, rotate: -12, opacity: 1 }} transition={{ delay: 0.35, type: 'spring', stiffness: 380, damping: 14 }}>
                  {picked.ending ? 'AWANTURA' : 'PODANE'}
                </motion.span>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
        {picked && !picked.ending && (
          <motion.div className="kn-reaction" data-testid="reaction" data-chef={mood} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <p className="kn-hand kn-reaction-text">„{picked.reaction}”</p>
            <div className="kn-deltas">
              {STAT_KEYS.flatMap((key) => {
                const value = picked.effects?.[key]
                return value ? [{ key, value }] : []
              }).map(({ key, value }, i) => (
                <Delta key={key} stat={key} value={value} delay={deltaDelay + i * 220} />
              ))}
            </div>
            <button type="button" className="kn-next" onClick={onNext} data-testid="next">
              {nextLabel}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export function Fail({ text, landed, onNext }: { text: string; landed: boolean; onNext: () => void }) {
  return (
    <section className="kn-fail" data-testid="fail" data-landed={landed}>
      <div className="kn-fail-stage">
        <motion.div className="kn-fail-owner" initial={{ rotate: 0 }} animate={{ rotate: -18, x: 20 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <Owner who="zbyszek" mood="upset" pot />
        </motion.div>
        <div className="kn-fail-chef">
          <Chef mood="appalled" kluski={landed} />
          {!landed &&
            [0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className="kn-klusek"
                style={{ left: `${22 + i * 13}%` }}
                initial={{ y: -180, opacity: 1 }}
                animate={{ y: 10 }}
                transition={{ delay: 0.6 + i * 0.08, duration: 0.5, ease: 'easeIn' }}
              />
            ))}
        </div>
      </div>
      <p className="kn-bubble kn-hand kn-fail-text">{text}</p>
      {landed && (
        <button type="button" className="kn-next" onClick={onNext} data-testid="next">
          Wynik
        </button>
      )}
    </section>
  )
}

export function EndingCard({ ending, mood, onNext }: { ending: Ending; mood: ChefMood; onNext: () => void }) {
  return (
    <motion.section className="kn-ending" data-testid="ending" data-title={ending.title} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
      <Chef mood={mood} className="kn-chef" />
      <div className="kn-bubble">
        <p className="kn-intro">Wizyta po miesiącu</p>
        <h2 className="kn-scene-title">{ending.title}</h2>
        <p>{ending.text}</p>
      </div>
      <button type="button" className="kn-next" onClick={onNext} data-testid="next">
        Wynik
      </button>
    </motion.section>
  )
}
