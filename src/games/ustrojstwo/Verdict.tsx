import { motion, useReducedMotion } from 'motion/react'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'

const TILTS = [-1.5, 1, 1.5, -1]
const LETTERS = ['A', 'B', 'C', 'D']

type LabelsProps = {
  options: string[]
  answer: string
  chosen: string | null
  onChoose: (option: string) => void
}

export function Labels({ options, answer, chosen, onChoose }: LabelsProps) {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {options.map((option, i) => {
        const isAnswer = option === answer
        const state =
          chosen === null ? '' : isAnswer ? 'ring-4 ring-green-500' : option === chosen ? 'ring-4 ring-red-500' : 'opacity-40'
        return (
          <motion.button
            key={option}
            className={`ship-label cursor-pointer rounded-sm p-3 text-left transition-opacity disabled:cursor-default ${state}`}
            initial={{ opacity: 0, y: 24, rotate: TILTS[i] }}
            animate={{ opacity: 1, y: 0, rotate: TILTS[i] }}
            whileHover={chosen === null ? { y: -5, rotate: 0 } : undefined}
            transition={{ delay: 0.9 + i * 0.08 }}
            disabled={chosen !== null}
            data-correct={isAnswer}
            onClick={() => onChoose(option)}
          >
            <div className="flex justify-between text-[10px] font-bold tracking-widest text-black/50">
              <span>PRZEZNACZENIE</span>
              <span>#{LETTERS[i]}</span>
            </div>
            <p className="mt-1 font-semibold leading-snug">{option}</p>
            <div className="barcode mt-2 w-2/3 opacity-70" />
          </motion.button>
        )
      })}
    </div>
  )
}

export function Stamp({ correct, onLanded }: { correct: boolean; onLanded: () => void }) {
  return (
    <motion.div
      className={`stamp pointer-events-none absolute left-1/2 top-1/3 z-20 -translate-x-1/2 whitespace-nowrap px-4 pt-1 text-4xl tracking-wider sm:text-7xl ${
        correct ? 'text-green-500' : 'text-red-500'
      }`}
      initial={{ scale: 3, opacity: 0, rotate: -35 }}
      animate={{ scale: 1, opacity: 0.92, rotate: -12 }}
      transition={{ duration: 0.22, ease: 'easeIn' }}
      onAnimationComplete={onLanded}
      data-testid="stamp"
    >
      {correct ? 'Dostarczono' : 'Zwrot do nadawcy'}
    </motion.div>
  )
}

export function Fact({ correct, fact, last, onNext }: { correct: boolean; fact: string; last: boolean; onNext: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center gap-3 text-center"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      onAnimationComplete={() => ref.current?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'nearest' })}
    >
      <p className="max-w-lg text-sm text-amber-50/80">{fact}</p>
      <Button size="lg" className="font-display text-xl tracking-widest" onClick={onNext} data-testid="next">
        {correct && !last ? 'Następna paczka' : 'Zobacz wynik'}
      </Button>
    </motion.div>
  )
}
