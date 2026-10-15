import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import { CircleMarker, MapContainer, Polyline, TileLayer, useMapEvents } from 'react-leaflet'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { pickN } from '@/shared/daily'
import { Hud, ResultScreen } from '@/shared/GameShell'
import places from './data.json'
import { distanceKm, MAX_ROUND_SCORE, roundScore, type LatLng } from './logic'

const ROUNDS = 5
type Place = (typeof places)[number]

async function fetchPhotoUrl(wikiTitle: string): Promise<string> {
  const params = new URLSearchParams({
    action: 'query',
    titles: wikiTitle,
    prop: 'pageimages',
    piprop: 'thumbnail',
    pithumbsize: '900',
    format: 'json',
    origin: '*',
  })
  const response = await fetch(`https://en.wikipedia.org/w/api.php?${params}`)
  if (!response.ok) throw new Error(`Wikipedia API: ${response.status}`)
  const body = await response.json()
  const page = Object.values(body.query.pages)[0] as { thumbnail?: { source: string } }
  if (!page.thumbnail) throw new Error(`Brak zdjęcia dla „${wikiTitle}”`)
  return page.thumbnail.source
}

function ClickToGuess({ onGuess }: { onGuess: (point: LatLng) => void }) {
  useMapEvents({ click: (event) => onGuess({ lat: event.latlng.lat, lng: event.latlng.lng }) })
  return null
}

export default function GdzieJestMartynaGame() {
  const [rounds, setRounds] = useState<Place[]>(() => pickN(places, ROUNDS))
  const [index, setIndex] = useState(0)
  const [photo, setPhoto] = useState<{ title: string; url: string } | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [guess, setGuess] = useState<LatLng | null>(null)
  const [scores, setScores] = useState<{ km: number; points: number }[]>([])

  const place = rounds[index]
  const revealed = scores.length > index
  const total = scores.reduce((sum, s) => sum + s.points, 0)

  useEffect(() => {
    if (!place) return
    let cancelled = false
    fetchPhotoUrl(place.wikiTitle)
      .then((url) => !cancelled && setPhoto({ title: place.wikiTitle, url }))
      .catch((error: Error) => !cancelled && setPhotoError(error.message))
    return () => {
      cancelled = true
    }
  }, [place])

  function confirmGuess() {
    const km = distanceKm(guess!, place)
    setScores([...scores, { km, points: roundScore(km) }])
  }

  function nextRound() {
    setIndex(index + 1)
    setGuess(null)
    setPhoto(null)
    setPhotoError(null)
  }

  function restart() {
    setRounds(pickN(places, ROUNDS))
    setScores([])
    setIndex(0)
    setGuess(null)
    setPhoto(null)
    setPhotoError(null)
  }

  if (index >= rounds.length) {
    return (
      <ResultScreen
        slug="gdzie-jest-martyna"
        score={total}
        maxScore={ROUNDS * MAX_ROUND_SCORE}
        summary={
          <ul className="text-sm">
            {rounds.map((p, i) => (
              <li key={p.name}>
                {p.name} ({p.country}): {Math.round(scores[i].km).toLocaleString('pl-PL')} km, {scores[i].points} pkt
              </li>
            ))}
          </ul>
        }
        onRestart={restart}
      />
    )
  }

  const currentPhoto = photo?.title === place.wikiTitle ? photo.url : null
  return (
    <>
      <Hud items={[['Runda', `${index + 1}/${ROUNDS}`], ['Punkty', total]]} />
      <Card className="py-0">
        <CardContent className="flex flex-col gap-3 p-3">
          <div className="flex h-64 items-center justify-center overflow-hidden rounded-lg bg-muted">
            {currentPhoto ? (
              <img src={currentPhoto} alt="Gdzie zrobiono to zdjęcie?" className="h-full w-full object-cover" data-testid="place-photo" />
            ) : (
              <p className="text-sm text-muted-foreground">{photoError ?? 'Ładowanie zdjęcia…'}</p>
            )}
          </div>
          <div className="h-80 overflow-hidden rounded-lg" data-testid="guess-map">
            <MapContainer center={[20, 20]} zoom={2} minZoom={2} worldCopyJump className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {!revealed && <ClickToGuess onGuess={setGuess} />}
              {guess && <CircleMarker center={guess} radius={8} pathOptions={{ color: '#2563eb' }} />}
              {revealed && guess && (
                <>
                  <CircleMarker center={place} radius={8} pathOptions={{ color: '#16a34a' }} />
                  <Polyline positions={[guess, place]} pathOptions={{ color: '#dc2626', dashArray: '6' }} />
                </>
              )}
            </MapContainer>
          </div>
          {revealed ? (
            <div className="flex flex-col items-center gap-2 text-center">
              <p>
                To <strong>{place.name}</strong> ({place.country}). Pomyłka:{' '}
                {Math.round(scores[index].km).toLocaleString('pl-PL')} km → <strong>{scores[index].points} pkt</strong>
              </p>
              <Button onClick={nextRound}>{index === ROUNDS - 1 ? 'Podsumowanie' : 'Dalej'}</Button>
            </div>
          ) : (
            <Button disabled={!guess} onClick={confirmGuess}>
              {guess ? 'Tu jest Martyna!' : 'Kliknij na mapie, gdzie zrobiono zdjęcie'}
            </Button>
          )}
          <p className="text-xs text-muted-foreground">Zdjęcia: Wikipedia / Wikimedia Commons. Mapa: OpenStreetMap.</p>
        </CardContent>
      </Card>
    </>
  )
}
