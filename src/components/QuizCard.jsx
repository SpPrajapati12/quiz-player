import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const DIFFICULTY_STYLES = {
  Easy: 'text-teal bg-teal/10 border-teal/30',
  Medium: 'text-gold bg-gold/10 border-gold/30',
  Hard: 'text-coral bg-coral/10 border-coral/30',
}

export default function QuizCard({ quiz, index }) {
  const navigate = useNavigate()
  const totalTime = quiz.timePerQuestion * quiz.totalQuestions

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-stage-line bg-stage-panel shadow-stage"
    >
      <div className="flex items-start justify-between gap-3 border-b border-stage-line p-6 pb-5">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
            {quiz.category}
          </p>
          <h3 className="mt-1.5 font-display text-xl font-semibold text-ink">
            {quiz.title}
          </h3>
        </div>
        <span
          className={`shrink-0 rounded-full border px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wide ${
            DIFFICULTY_STYLES[quiz.difficulty] ?? 'text-ink-dim bg-stage-line/40 border-stage-line'
          }`}
        >
          {quiz.difficulty}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6 pt-5">
        <p className="text-sm leading-relaxed text-ink-dim">{quiz.description}</p>

        <div className="mt-auto grid grid-cols-2 gap-3 font-mono text-xs text-ink-dim">
          <div className="rounded-xl bg-stage-bg/60 px-3 py-2">
            <p className="text-ink-faint">Questions</p>
            <p className="mt-0.5 text-sm font-bold text-ink">{quiz.totalQuestions}</p>
          </div>
          <div className="rounded-xl bg-stage-bg/60 px-3 py-2">
            <p className="text-ink-faint">Per Question</p>
            <p className="mt-0.5 text-sm font-bold text-ink">{quiz.timePerQuestion}s</p>
          </div>
          <div className="col-span-2 rounded-xl bg-stage-bg/60 px-3 py-2">
            <p className="text-ink-faint">Est. Total Time</p>
            <p className="mt-0.5 text-sm font-bold text-ink">
              ~{Math.ceil(totalTime / 60)} min
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/quiz/${quiz.id}`)}
          className="mt-2 w-full rounded-xl bg-gold py-3 font-display text-sm font-bold uppercase tracking-wide text-stage-bg transition-transform duration-150 hover:brightness-105 active:scale-[0.98]"
        >
          Play Quiz
        </button>
      </div>
    </motion.article>
  )
}
