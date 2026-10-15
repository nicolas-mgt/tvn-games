import { AnimatePresence, motion } from 'motion/react'
import { PLAYER, placeOf, TEAM_COLORS, teamMood, type Team } from './logic'
import { Host, TeamFigure } from './Team'

type ArrivalProps = { stop: string; day: number; teams: Team[]; legHours: number[]; nextLabel: string; onNext: () => void }

export function Arrival({ stop, day, teams, legHours, nextLabel, onNext }: ArrivalProps) {
  const rows = teams
    .map((team, i) => ({ team, i, place: placeOf(teams, i) }))
    .filter(({ team }) => team.alive)
    .sort((a, b) => a.team.hours - b.team.hours)
  return (
    <section className="ex-arrival" data-testid="arrival">
      <motion.div className="ex-passport-stamp" initial={{ scale: 2.4, rotate: -30, opacity: 0 }} animate={{ scale: 1, rotate: -8, opacity: 1 }} transition={{ type: 'spring', stiffness: 420, damping: 16 }}>
        <span>{stop}</span>
        <small>Dzień {day}</small>
      </motion.div>
      <ol className="ex-standings" data-testid="standings">
        {rows.map(({ team, i, place }, n) => (
          <motion.li
            key={team.name}
            data-team={team.name}
            data-hours={team.hours}
            data-place={place}
            data-player={i === PLAYER}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + n * 0.25 }}
          >
            <b className="ex-place" style={{ background: TEAM_COLORS[i] }}>
              {place}
            </b>
            <TeamFigure team={team.name} mood={teamMood({ alive: true, place, saved: false, eliminatedNow: false })} className="ex-row-face" />
            <span className="ex-row-name">{team.name}</span>
            <span className="ex-row-leg ex-hand">+{legHours[i]} h</span>
            <span className="ex-row-total">{team.hours} h</span>
          </motion.li>
        ))}
      </ol>
      <button type="button" className="ex-next" onClick={onNext} data-testid="next">
        {nextLabel}
      </button>
    </section>
  )
}

type EliminationProps = { teams: Team[]; eliminated: number | null; saved: boolean; open: boolean; nextLabel: string; onNext: () => void }

export function Elimination({ teams, eliminated, saved, open, nextLabel, onNext }: EliminationProps) {
  const shown = teams.flatMap((team, i) => (team.alive ? [i] : []))
  return (
    <section className="ex-elimination" data-testid="elimination" data-eliminated={eliminated === null ? '' : teams[eliminated].name} data-saved={saved} data-open={open}>
      <div className="ex-host-row">
        <Host open={open} className="ex-host" />
        <AnimatePresence>
          {open && (
            <motion.p className="ex-verdict-card ex-hand" initial={{ opacity: 0, y: 20, rotate: -6 }} animate={{ opacity: 1, y: 0, rotate: -3 }}>
              {saved ? 'Byliście ostatni, ale amulet was ratuje!' : eliminated === PLAYER ? 'Odpadacie. Koniec wyprawy.' : `Odpadają: ${teams[eliminated!].name}`}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <div className="ex-lineup">
        {shown.map((i) => {
          const out = open && eliminated === i
          return (
            <motion.div key={teams[i].name} className="ex-lineup-team" animate={out ? { opacity: 0.5, filter: 'grayscale(1)', y: 8 } : {}} transition={{ duration: 0.8 }}>
              {saved && open && i === PLAYER && <span className="ex-amulet-burst" aria-hidden />}
              <TeamFigure
                team={teams[i].name}
                mood={open ? teamMood({ alive: true, place: placeOf(teams, i), saved: saved && i === PLAYER, eliminatedNow: out }) : 'worried'}
                className="ex-lineup-face"
              />
              <span className="ex-row-name">{teams[i].name}</span>
            </motion.div>
          )
        })}
      </div>
      {open && (
        <button type="button" className="ex-next" onClick={onNext} data-testid="next">
          {nextLabel}
        </button>
      )}
    </section>
  )
}
