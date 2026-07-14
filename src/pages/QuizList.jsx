import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import QuizCard from '../components/QuizCard'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import quizData from '../data/quiz.json'

export default function QuizList() {
  const [quizzes, setQuizzes] = useState(null)

  useEffect(() => {
    // Simulated async load — keeps the data-fetching seam realistic
    // even though quiz.json ships with the bundle.
    const id = setTimeout(() => setQuizzes(quizData.quizzes ?? []), 350)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-6 py-14 sm:px-10">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-12 max-w-2xl"
      >
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-gold">
          Tonight&rsquo;s Lineup
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
          Step up to the mic.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-ink-dim">
          Five categories, ten questions each, one clock ticking on every one.
          Pick a quiz below and see how you place on the leaderboard.
        </p>
      </motion.header>

      {quizzes === null && <Loader label="Setting the stage" />}

      {quizzes !== null && quizzes.length === 0 && (
        <EmptyState
          title="No quizzes available"
          description="Check back soon — new rounds are added regularly."
        />
      )}

      {quizzes !== null && quizzes.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz, index) => (
            <QuizCard key={quiz.id} quiz={quiz} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
