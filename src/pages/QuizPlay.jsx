import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ProgressBar from '../components/ProgressBar'
import TimerRing from '../components/TimerRing'
import OptionButton from '../components/OptionButton'
import Loader from '../components/Loader'
import EmptyState from '../components/EmptyState'
import { useQuizTimer } from '../hooks/useQuizTimer'
import { shuffleArray } from '../utils/shuffle'
import quizData from '../data/quiz.json'

const REVEAL_DELAY_MS = 900

export default function QuizPlay() {
  const { quizId } = useParams()
  const navigate = useNavigate()

  const quiz = useMemo(
    () => quizData.quizzes.find((q) => q.id === quizId) ?? null,
    [quizId]
  )

  // Shuffle questions and each question's options once per attempt.
  const questions = useMemo(() => {
    if (!quiz) return []
    return shuffleArray(quiz.questions).map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }))
  }, [quiz])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [answers, setAnswers] = useState([])
  const advanceTimeoutRef = useRef(null)

  const currentQuestion = questions[currentIndex]
  const isLast = currentIndex === questions.length - 1

  const goToNext = (finalAnswers) => {
    if (isLast) {
      navigate(`/quiz/${quizId}/result`, {
        state: { quiz, answers: finalAnswers, questions },
      })
      return
    }
    setCurrentIndex((i) => i + 1)
    setSelected(null)
    setIsRevealed(false)
  }

  const recordAnswer = (chosenOption, timedOut) => {
    const isCorrect = !timedOut && chosenOption === currentQuestion.correctAnswer
    const record = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      chosenOption: chosenOption ?? null,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      points: isCorrect ? currentQuestion.points : 0,
      timedOut,
    }
    const updated = [...answers, record]
    setAnswers(updated)
    return updated
  }

  const handleExpire = () => {
    if (isRevealed) return
    setIsRevealed(true)
    const updated = recordAnswer(selected, selected == null)
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current)
    }
    advanceTimeoutRef.current = setTimeout(() => goToNext(updated), REVEAL_DELAY_MS)
  }

  const secondsLeft = useQuizTimer(
    currentQuestion?.timePerQuestion ?? quiz?.timePerQuestion ?? 15,
    currentIndex,
    handleExpire,
    isRevealed
  )

  const handleSelect = (option) => {
    if (isRevealed) return
    setSelected(option)
  }

  const handleNext = () => {
    if (selected == null || isRevealed) return
    setIsRevealed(true)
    const updated = recordAnswer(selected, false)
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current)
    }
    advanceTimeoutRef.current = setTimeout(() => goToNext(updated), REVEAL_DELAY_MS)
  }

  useEffect(() => () => clearTimeout(advanceTimeoutRef.current), [])

  if (!quiz) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20">
        <EmptyState
          title="Quiz not found"
          description="This quiz may have been removed. Head back to the lineup and pick another."
          action={
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-2 rounded-xl bg-gold px-5 py-2.5 font-display text-sm font-bold text-stage-bg"
            >
              Back to quizzes
            </button>
          }
        />
      </div>
    )
  }

  if (!currentQuestion) {
    return <Loader label="Loading the round" />
  }

  const timePerQuestion = currentQuestion.timePerQuestion ?? quiz.timePerQuestion

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-14 sm:px-10">
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-gold">
              {quiz.title}
            </p>
          </div>
        </div>
        <ProgressBar current={currentIndex + 1} total={questions.length} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="rounded-3xl border border-stage-line bg-stage-panel p-6 shadow-stage sm:p-8"
        >
          <div className="mb-6 flex items-start justify-between gap-6">
            <h2 className="font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
              {currentQuestion.question}
            </h2>
            <TimerRing secondsLeft={secondsLeft} totalSeconds={timePerQuestion} />
          </div>

          <div className="flex flex-col gap-3">
            {currentQuestion.options.map((option, i) => (
              <OptionButton
                key={option}
                option={option}
                index={i}
                isSelected={selected === option}
                isRevealed={isRevealed}
                isCorrectAnswer={option === currentQuestion.correctAnswer}
                onSelect={() => handleSelect(option)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={selected == null || isRevealed}
            className="mt-7 w-full rounded-xl bg-gold py-3.5 font-display text-sm font-bold uppercase tracking-wide text-stage-bg transition-all duration-150 hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-stage-line disabled:text-ink-faint"
          >
            {isLast ? 'Finish Quiz' : 'Next Question'}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
