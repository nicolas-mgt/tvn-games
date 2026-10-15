import { useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { play } from './sfx'

type TaskCardProps = { number: number; title: string; instruction: string }

export function TaskCard({ number, title, instruction }: TaskCardProps) {
  return (
    <div className="uk-task-card" data-testid="task-card">
      <p className="uk-task-number">Zadanie {number}</p>
      <h2 className="uk-task-title">{title}</h2>
      <p className="uk-task-text">{instruction}</p>
    </div>
  )
}

type EnvelopeProps = TaskCardProps & { onOpened: () => void }

export function Envelope({ number, title, instruction, onOpened }: EnvelopeProps) {
  const [open, setOpen] = useState(false)
  const reducedMotion = useReducedMotion()

  function breakSeal() {
    setOpen(true)
    play('seal')
    setTimeout(() => play('paper'), 250)
    setTimeout(() => play('card'), 650)
    setTimeout(onOpened, reducedMotion ? 300 : 1700)
  }

  return (
    <div className="uk-envelope" data-open={open} data-testid="envelope">
      <div className="uk-envelope-back" />
      <div className="uk-envelope-card">
        <TaskCard number={number} title={title} instruction={instruction} />
      </div>
      <div className="uk-envelope-front">
        <span className="uk-envelope-label uk-hand">Zadanie nr {number}</span>
      </div>
      <div className="uk-envelope-flap" />
      <button type="button" className="uk-seal" onClick={breakSeal} disabled={open} aria-label="Przełam pieczęć" data-testid="seal">
        <span className="uk-seal-half uk-seal-left" />
        <span className="uk-seal-half uk-seal-right" />
        <svg viewBox="0 0 40 40" className="uk-seal-crown" aria-hidden>
          <path d="M8 28 L10 12 L16 20 L20 9 L24 20 L30 12 L32 28 Z" fill="none" stroke="#5c0d12" strokeWidth="2.4" strokeLinejoin="round" />
        </svg>
      </button>
      {!open && <p className="uk-envelope-hint uk-hand">Przełam pieczęć</p>}
    </div>
  )
}
