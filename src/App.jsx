import { Route, Routes, Link } from 'react-router-dom'
import QuizList from './pages/QuizList'
import QuizPlay from './pages/QuizPlay'
import QuizResult from './pages/QuizResult'
import ThemeToggle from './components/ThemeToggle'

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-gold">404</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-ink">Off the map</h1>
      <p className="mt-3 text-ink-dim">That page doesn&rsquo;t exist. Let&rsquo;s get you back on stage.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-xl bg-gold px-6 py-3 font-display text-sm font-bold text-stage-bg"
      >
        Back to quizzes
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-stage-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold font-display text-sm font-bold text-stage-bg">
              Q
            </span>
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              Quiz Show
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/quiz/:quizId" element={<QuizPlay />} />
          <Route path="/quiz/:quizId/result" element={<QuizResult />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}
