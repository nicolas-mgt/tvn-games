import { animate, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { formatZl } from './logic'

export type Choice = 'stay' | 'switch' | 'cash'

type CashOfferProps = {
  picked: number
  switchTo: number
  cash: number
  onDecide: (choice: Choice) => void
}

export function CashOffer({ picked, switchTo, cash, onDecide }: CashOfferProps) {
  const reducedMotion = useReducedMotion()
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const controls = animate(0, cash, {
      duration: reducedMotion ? 0 : 0.9,
      delay: reducedMotion ? 0 : 0.3,
      ease: 'easeOut',
      onUpdate: (value) => setShown(Math.round(value / 50) * 50),
    })
    return () => controls.stop()
  }, [cash, reducedMotion])

  return (
    <motion.div className="flex w-full flex-col items-center gap-5 sm:flex-row sm:justify-center sm:gap-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <motion.div className="zk-envelope" initial={{ rotate: -8, scale: 0.6 }} animate={{ rotate: -3, scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
        <p className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">Koperta</p>
        <p className="relative font-display text-4xl tabular-nums" data-testid="cash-offer">
          {formatZl(shown)}
        </p>
      </motion.div>
      <div className="flex w-full max-w-sm flex-col gap-3 sm:w-auto">
        <button type="button" className="zk-studio-button" data-variant="stay" data-testid="decide-stay" onClick={() => onDecide('stay')}>
          Zostaję przy nr {picked + 1}
        </button>
        <button type="button" className="zk-studio-button" data-variant="switch" data-testid="decide-switch" onClick={() => onDecide('switch')}>
          Zamieniam na nr {switchTo + 1}
        </button>
        <button type="button" className="zk-studio-button" data-variant="cash" data-testid="decide-cash" onClick={() => onDecide('cash')}>
          Biorę kopertę
        </button>
      </div>
    </motion.div>
  )
}
