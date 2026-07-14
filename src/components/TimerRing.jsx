import { motion } from 'framer-motion'

/**
 * A circular countdown ring, styled like a stage spotlight clock.
 * Turns coral and pulses in the final 5 seconds to build urgency.
 */
export default function TimerRing({ secondsLeft, totalSeconds }) {
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(secondsLeft, 0) / totalSeconds
  const isUrgent = secondsLeft <= 5

  return (
    <div className="relative h-20 w-20 shrink-0">
      <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90">
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="#332C7A"
          strokeWidth="6"
        />
        <motion.circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke={isUrgent ? '#FB6F92' : '#F2B705'}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: circumference * (1 - progress) }}
          transition={{ duration: 0.9, ease: 'linear' }}
        />
      </svg>
      <div
        className={`absolute inset-0 flex items-center justify-center font-mono text-xl font-bold ${
          isUrgent ? 'text-coral animate-pulseRing' : 'text-ink'
        }`}
      >
        {Math.max(secondsLeft, 0)}
      </div>
    </div>
  )
}
