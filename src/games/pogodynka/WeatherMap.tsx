import poland from './poland.json'
import { CITIES, MAP_H, MAP_W, project, weatherKind, type CityId, type WeatherKind } from './logic'

const CLOUD = 'M-22 6 a12 12 0 0 1 4 -22 a16 16 0 0 1 30 -2 a11 11 0 0 1 10 24 Z'

function Sun({ r = 13 }: { r?: number }) {
  return (
    <g>
      <g className="pg-sun-rays" stroke="#ffd34d" strokeWidth="4" strokeLinecap="round">
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d={`M0 ${-r - 5} v-6`} transform={`rotate(${i * 45})`} />
        ))}
      </g>
      <circle r={r} fill="#ffd34d" />
    </g>
  )
}

function Cloud({ fill = '#f4f6fa' }: { fill?: string }) {
  return <path d={CLOUD} fill={fill} stroke="#9aa8c0" strokeWidth="1.5" />
}

export function WeatherIcon({ kind }: { kind: WeatherKind }) {
  switch (kind) {
    case 'sun':
      return <Sun />
    case 'partly':
      return (
        <>
          <g transform="translate(8 -10)">
            <Sun r={10} />
          </g>
          <Cloud />
        </>
      )
    case 'fog':
      return (
        <g className="pg-fog" stroke="#d8dee8" strokeWidth="4" strokeLinecap="round">
          <path d="M-20 -10 h40 M-24 0 h44 M-18 10 h36" />
        </g>
      )
    case 'rain':
      return (
        <>
          <g className="pg-drops" stroke="#6ab0ff" strokeWidth="3" strokeLinecap="round">
            {[-12, 0, 12].map((x, i) => (
              <path key={x} d={`M${x} 10 l-3 8`} style={{ animationDelay: `${i * 0.25}s` }} />
            ))}
          </g>
          <Cloud fill="#d0d8e4" />
        </>
      )
    case 'snow':
      return (
        <>
          <g className="pg-flakes" fill="#fff">
            {[-12, 0, 12].map((x, i) => (
              <circle key={x} cx={x} cy="14" r="3" style={{ animationDelay: `${i * 0.4}s` }} />
            ))}
          </g>
          <Cloud />
        </>
      )
    case 'storm':
      return (
        <>
          <path className="pg-bolt" d="M2 4 l-9 14 h7 l-4 12 l12 -16 h-7 l5 -10 Z" fill="#ffd34d" />
          <Cloud fill="#8a98b0" />
        </>
      )
    default:
      return <Cloud />
  }
}

/** Poland on the studio screen with an animated icon and an optional bubble per city. */
export function WeatherMap({ codes, bubbles, active }: { codes: Record<CityId, number> | null; bubbles: Record<CityId, string> | null; active?: CityId | null }) {
  return (
    <div className="pg-screen">
      <svg viewBox={`-20 -10 ${MAP_W + 40} ${MAP_H + 20}`} className="pg-map" role="img" aria-label="Mapa Polski z prognozą">
        <path d={poland.d} fill="#3a9a5a" stroke="#c8f0c8" strokeWidth="3" strokeLinejoin="round" />
        {CITIES.map((city) => {
          const { x, y } = project(city.lat, city.lng)
          const kind = codes ? weatherKind(codes[city.id]) : null
          return (
            <g key={city.id} transform={`translate(${x} ${y})`} data-active={active === city.id} className="pg-city">
              {active === city.id && <circle r="20" className="pg-city-ring" />}
              <circle r="7" fill="#fff" stroke="#0a1a3a" strokeWidth="3" />
              <text y="28" textAnchor="middle" fontSize="22" fill="#fff" className="pg-sign pg-city-name">
                {city.name}
              </text>
              {kind && (
                <g transform="translate(-34 -26) scale(1.25)" data-testid="weather-icon" data-city={city.id} data-kind={kind}>
                  <WeatherIcon kind={kind} />
                </g>
              )}
              {bubbles && (
                <g transform="translate(12 -44)" data-testid="map-guess" data-city={city.id}>
                  <rect width="74" height="34" rx="8" fill="#fff" />
                  <text x="37" y="25" textAnchor="middle" fontSize="24" fill="#0a1a3a" className="pg-sign">
                    {bubbles[city.id]}
                  </text>
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
