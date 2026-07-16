import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'
import Confetti from '../components/Confetti'
import Loader from '../components/Loader'

function getPerformanceMessage(pct) {
  if (pct === 100) return { text: 'Perfect round. Flawless.', tone: 'text-gold' }
  if (pct >= 80) return { text: 'Outstanding performance!', tone: 'text-gold' }
  if (pct >= 60) return { text: 'Solid showing out there.', tone: 'text-teal' }
  if (pct >= 40) return { text: 'Decent — room to climb.', tone: 'text-ink' }
  return { text: 'Tough round. Try again!', tone: 'text-coral' }
}

export default function QuizResult() {
  const { quizId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { quiz, answers } = location.state ?? {}

  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [leaderboard, setLeaderboard] = useState(null)
  const [leaderboardError, setLeaderboardError] = useState(null)

  const stats = useMemo(() => {
    if (!answers) return null
    const correct = answers.filter((a) => a.isCorrect).length
    const wrong = answers.length - correct
    const score = answers.reduce((sum, a) => sum + a.points, 0)
    const maxScore = answers.reduce(
      (sum, a) => sum + (a.points || 10),
      0
    )
    const percentage = answers.length ? Math.round((correct / answers.length) * 100) : 0
    return { correct, wrong, score, maxScore, percentage, total: answers.length }
  }, [answers])

  const performance = stats ? getPerformanceMessage(stats.percentage) : null

  const fetchLeaderboard = async () => {
    try {
      setLeaderboardError(null)
      const q = query(
        collection(db, 'leaderboard'),
        where('quizId', '==', quizId),
        // orderBy('score', 'desc'),
        // orderBy('completedAt', 'desc'),
        limit(10)
      )
      const snap = await getDocs(q)//////
      const leaderboard = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          return (
            b.completedAt.seconds -
            a.completedAt.seconds
          );
        });
      console.log('Leaderboard snapshot:', snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLeaderboard(leaderboard)
    } catch (err) {
      console.log(err)
      setLeaderboardError(
        'Could not load the leaderboard. Add your Firebase credentials in .env to enable it.'
      )
      setLeaderboard([])
    }
  }

  useEffect(() => {
    if (!quiz || !stats) return
    fetchLeaderboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, stats])

  const handleSubmitScore = async (e) => {
    e.preventDefault()
    if (!name.trim() || !quiz || !stats) return
    setSaving(true)
    setSaveError(null)
    try {
      await addDoc(collection(db, 'leaderboard'), {
        name: name.trim(),
        quizId: quiz.id,
        quizTitle: quiz.title,
        score: stats.score,
        percentage: stats.percentage,
        completedAt: serverTimestamp(),
      })
      setSubmitted(true)
      fetchLeaderboard()
    } catch (err) {
      setSaveError('Could not save your score. Check your Firebase setup in .env.')
    } finally {
      setSaving(false)
    }
  }

  if (!quiz || !stats) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink">No result to show</h2>
        <p className="mt-3 text-ink-dim">Play a quiz first to see your results here.</p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-6 rounded-xl bg-gold px-6 py-3 font-display text-sm font-bold text-stage-bg"
        >
          Browse quizzes
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-14 sm:px-10">
      {stats.percentage >= 80 && <Confetti />}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-3xl border border-stage-line bg-stage-panel p-8 text-center shadow-stage"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-gold">{quiz.title}</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">Results are in</h1>
        <p className={`mt-2 font-display text-lg font-semibold ${performance.tone}`}>
          {performance.text}
        </p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4, ease: 'backOut' }}
          className="mx-auto mt-8 flex h-36 w-36 flex-col items-center justify-center rounded-full border-4 border-gold bg-stage-bg/60"
        >
          <span className="font-mono text-4xl font-bold text-gold">{stats.percentage}%</span>
          <span className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
            Score
          </span>
        </motion.div>

        <div className="mt-8 grid grid-cols-3 gap-3 font-mono">
          <div className="rounded-xl bg-stage-bg/60 px-3 py-4">
            <p className="text-2xl font-bold text-ink">{stats.score}</p>
            <p className="mt-1 text-[11px] uppercase tracking-widest text-ink-faint">Points</p>
          </div>
          <div className="rounded-xl bg-stage-bg/60 px-3 py-4">
            <p className="text-2xl font-bold text-teal">{stats.correct}</p>
            <p className="mt-1 text-[11px] uppercase tracking-widest text-ink-faint">Correct</p>
          </div>
          <div className="rounded-xl bg-stage-bg/60 px-3 py-4">
            <p className="text-2xl font-bold text-coral">{stats.wrong}</p>
            <p className="mt-1 text-[11px] uppercase tracking-widest text-ink-faint">Wrong</p>
          </div>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmitScore} className="mt-8 text-left">
            <label htmlFor="player-name" className="font-mono text-xs uppercase tracking-widest text-ink-faint">
              Save your score to the leaderboard
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="player-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                maxLength={30}
                className="w-full rounded-xl border-2 border-stage-line bg-stage-panel px-4 py-2.5 text-ink placeholder:text-ink-faint shadow-sm transition duration-150 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
              <button
                type="submit"
                disabled={!name.trim() || saving}
                className="shrink-0 rounded-xl bg-gold px-5 py-2.5 font-display text-sm font-bold text-stage-bg disabled:cursor-not-allowed disabled:bg-stage-line disabled:text-ink-faint"
              >
                {saving ? 'Saving…' : 'Submit'}
              </button>
            </div>
            {saveError && <p className="mt-2 text-sm text-coral">{saveError}</p>}
          </form>
        ) : (
          <p className="mt-8 font-mono text-sm text-teal">Score saved to the leaderboard.</p>
        )}

        <button
          type="button"
          onClick={() => navigate(`/quiz/${quizId}`)}
          className="mt-6 w-full rounded-xl border-2 border-stage-line py-3 font-display text-sm font-bold uppercase tracking-wide text-ink transition-colors hover:border-gold"
        >
          Play Again
        </button>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-3 font-mono text-xs uppercase tracking-widest text-ink-faint hover:text-ink"
        >
          Back to all quizzes
        </button>
      </motion.div>

      <div className="mt-10">
        <h2 className="mb-4 font-display text-xl font-semibold text-ink">Top 10 — {quiz.title}</h2>

        {leaderboard === null && <Loader label="Fetching leaderboard" />}

        {leaderboardError && <p className="text-sm text-ink-dim">{leaderboardError}</p>}

        {leaderboard && leaderboard.length === 0 && !leaderboardError && (
          <p className="rounded-2xl border border-dashed border-stage-line px-6 py-8 text-center text-sm text-ink-dim">
            No scores yet — be the first on the board.
          </p>
        )}

        {leaderboard && leaderboard.length > 0 && (
          <ol className="flex flex-col gap-2">
            {leaderboard.map((entry, i) => (
              <li
                key={entry.id}
                className="flex items-center gap-4 rounded-xl border border-stage-line bg-stage-panel px-4 py-3"
              >
                <span className="w-6 shrink-0 font-mono text-sm font-bold text-ink-faint">
                  {i + 1}
                </span>
                <span className="flex-1 truncate font-body text-sm font-medium text-ink">
                  {entry.name}
                </span>
                <span className="font-mono text-xs text-ink-dim">{entry.percentage}%</span>
                <span className="font-mono text-sm font-bold text-gold">{entry.score} pts</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
