import { useEffect, useState } from 'react'
import { toggleTheme, currentTheme } from '../theme'

export default function ThemeToggle() {
  const [theme, setTheme] = useState(currentTheme())

  useEffect(() => {
    const handler = (e) => setTheme(e.detail)
    window.addEventListener('themechange', handler)
    return () => window.removeEventListener('themechange', handler)
  }, [])

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => toggleTheme()}
      className="inline-flex items-center justify-center rounded-lg p-2 text-ink-dim hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      {theme === 'dark' ? (
        // Sun icon for light (since clicking will switch to light)
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-sun">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2"></path>
          <path d="M12 20v2"></path>
          <path d="M4.93 4.93l1.41 1.41"></path>
          <path d="M17.66 17.66l1.41 1.41"></path>
          <path d="M2 12h2"></path>
          <path d="M20 12h2"></path>
          <path d="M4.93 19.07l1.41-1.41"></path>
          <path d="M17.66 6.34l1.41-1.41"></path>
        </svg>
      ) : (
        // Moon icon for dark
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-moon">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
        </svg>
      )}
    </button>
  )
}
