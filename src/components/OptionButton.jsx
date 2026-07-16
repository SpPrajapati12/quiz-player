import { motion } from 'framer-motion'

const LETTERS = ['A', 'B', 'C', 'D']

export default function OptionButton({
  option,
  index,
  isSelected,
  isRevealed,
  isCorrectAnswer,
  onSelect,
}) {
  let stateClasses = 'border-stage-line bg-stage-panel hover:border-ink-faint hover:bg-stage-panel2'
  let letterClasses = 'bg-stage-line text-ink-dim'

  if (isRevealed) {
    if (isCorrectAnswer) {
      stateClasses = 'border-green-500 bg-teal/10'
      letterClasses = 'bg-green-500 text-white'
    } else if (isSelected && !isCorrectAnswer) {
      stateClasses = 'border-red-500 bg-coral/10'
      letterClasses = 'bg-red-500 text-white'
    } else {
      stateClasses = 'border-stage-line bg-stage-panel/50 opacity-50'
    }
  } else if (isSelected) {
    stateClasses = 'border-gold bg-gold/10 shadow-glow'
    letterClasses = 'bg-gold text-stage-bg'
  }

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={isRevealed}
      whileTap={!isRevealed ? { scale: 0.98 } : undefined}
      className={`flex w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left font-body text-base font-medium text-ink transition-colors duration-150 disabled:cursor-default ${stateClasses}`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-sm font-bold transition-colors ${letterClasses}`}
      >
        {LETTERS[index]}
      </span>
      <span className="flex-1">{option}</span>
      {isRevealed && isCorrectAnswer && <span className="text-teal">✓</span>}
      {isRevealed && isSelected && !isCorrectAnswer && <span className="text-coral">✕</span>}
    </motion.button>
  )
}
