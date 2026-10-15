import { useEffect, useRef, useState } from 'react'

/** Counts down in 100 ms steps while `running`; calls `onExpire` when it reaches zero. */
export function useCountdown(seconds: number, running: boolean, onExpire: () => void) {
  const [remaining, setRemaining] = useState(seconds)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onExpireRef.current = onExpire
  })

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setRemaining((value) => Math.max(0, value - 0.1)), 100)
    return () => clearInterval(id)
  }, [running])

  useEffect(() => {
    if (running && remaining === 0) onExpireRef.current()
  }, [running, remaining])

  return { remaining, setRemaining }
}
