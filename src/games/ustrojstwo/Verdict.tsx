import { motion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'

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

export function VerdictDialog({ correct, finished, children }: { correct: boolean; finished: boolean; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby="verdict-title"
      className="m-auto max-h-[calc(100svh-2rem)] w-[min(32rem,calc(100vw-2rem))] overflow-y-auto rounded-lg border-2 border-amber-200/40 bg-[#201810] p-5 text-amber-50 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm [&_button]:cursor-pointer"
      onCancel={(event) => event.preventDefault()}
      data-testid="verdict-dialog"
    >
      <div className="mb-5 text-center">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-amber-200/60">Sortownia nr 7 · raport doręczenia</p>
        <h2 id="verdict-title" className={`font-display text-5xl tracking-wider ${correct ? 'text-green-400' : 'text-red-400'}`}>
          {finished ? 'Koniec gry' : 'Paczka dostarczona!'}
        </h2>
        <p className="mt-2 text-sm text-amber-50/80">
          {!correct ? 'Błędna odpowiedź. Ta paczka kończy Twoją serię.' : finished ? 'Wszystkie paczki rozpoznane. Zmiana zakończona!' : 'Dobra robota! Taśma czeka na Twój sygnał.'}
        </p>
      </div>
      {children}
    </dialog>
  )
}
