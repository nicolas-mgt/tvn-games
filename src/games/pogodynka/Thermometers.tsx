import { motion } from 'motion/react'
import { CITIES, cityPoints, formatTemp, MAX_TEMP, MIN_TEMP, type CityId, type Temperatures } from './logic'
import { play } from './sfx'

let lastClick = 0
function clickSoon() {
  const now = performance.now()
  if (now - lastClick < 90) return
  lastClick = now
  play('click')
}

export function Thermometers({ values, onChange, onFocusCity }: { values: Temperatures; onChange: (id: CityId, value: number) => void; onFocusCity: (id: CityId) => void }) {
  return (
    <div className="pg-thermos">
      {CITIES.map((city) => {
        const value = values[city.id]
        const fill = ((value - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * 100
        return (
          <label key={city.id} className="pg-thermo">
            <span className="pg-thermo-value pg-sign">{formatTemp(value)}</span>
            <span className="pg-tube">
              <span className="pg-mercury" style={{ height: `${fill}%` }} />
              <input
                type="range"
                min={MIN_TEMP}
                max={MAX_TEMP}
                step={0.5}
                value={value}
                onChange={(e) => {
                  onChange(city.id, Number(e.target.value))
                  clickSoon()
                }}
                onFocus={() => onFocusCity(city.id)}
                onPointerDown={() => onFocusCity(city.id)}
                aria-label={`Maksimum ${city.name}`}
                data-testid={`thermo-${city.id}`}
              />
            </span>
            <span className="pg-bulb" />
            <span className="pg-thermo-name">{city.name}</span>
          </label>
        )
      })}
    </div>
  )
}

/** Guess and actual maximum as two bars per city, growing one city after another. */
export function SettleBars({ guesses, actual, pace }: { guesses: Temperatures; actual: Temperatures; pace: number }) {
  const all = CITIES.flatMap((c) => [guesses[c.id], actual[c.id]])
  const low = Math.min(...all) - 3
  const high = Math.max(...all) + 2
  const height = (v: number) => `${((v - low) / (high - low)) * 100}%`
  return (
    <div className="pg-bars">
      {CITIES.map((city, i) => {
        const points = cityPoints(guesses[city.id], actual[city.id])
        const delay = (0.3 + i * 0.6) * pace
        return (
          <div key={city.id} className="pg-bar-city" data-testid="settle-city" data-city={city.id} data-points={points}>
            <div className="pg-bar-pair">
              <motion.span className="pg-col pg-col-guess" initial={{ height: 0 }} animate={{ height: height(guesses[city.id]) }} transition={{ delay, duration: 0.5 * pace + 0.1 }}>
                <b>{formatTemp(guesses[city.id])}</b>
              </motion.span>
              <motion.span
                className="pg-col pg-col-actual"
                initial={{ height: 0 }}
                animate={{ height: height(actual[city.id]) }}
                transition={{
                  delay: delay + 0.25 * pace,
                  duration: 0.5 * pace + 0.1,
                }}
              >
                <b>{formatTemp(actual[city.id])}</b>
              </motion.span>
            </div>
            <motion.span
              className="pg-bar-points pg-sign"
              data-perfect={points === 10}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.6 * pace }}
            >
              +{points}
            </motion.span>
            <span className="pg-thermo-name">{city.name}</span>
          </div>
        )
      })}
      <p className="pg-bars-legend">
        <i className="pg-col-guess" /> twój typ <i className="pg-col-actual" /> było naprawdę
      </p>
    </div>
  )
}
