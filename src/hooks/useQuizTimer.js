import { useEffect, useRef, useState } from 'react'

/**
 * Runs a countdown from `duration` seconds, restarting whenever
 * `resetKey` changes. Calls `onExpire` once when it hits zero.
 * Paused when `paused` is true (e.g. after an option is selected).
 */
export function useQuizTimer(duration, resetKey, onExpire, paused = false) {
  const [secondsLeft, setSecondsLeft] = useState(duration)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    setSecondsLeft(duration)
  }, [resetKey, duration])

  useEffect(() => {
    if (paused) return undefined
    if (secondsLeft <= 0) {
      onExpireRef.current?.()
      return undefined
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(id)
  }, [secondsLeft, paused])

  return secondsLeft
}
