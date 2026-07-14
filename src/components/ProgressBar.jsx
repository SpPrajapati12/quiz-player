import { motion } from 'framer-motion'

export default function ProgressBar({ current, total }) {
  const pct = (current / total) * 100
  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between font-mono text-xs text-ink-faint">
        <span>
          QUESTION {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-stage-line">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-teal to-gold"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
