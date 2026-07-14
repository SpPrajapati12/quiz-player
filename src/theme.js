// Initializes theme based on localStorage or system preference
const THEME_KEY = 'theme'

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'dark' || stored === 'light') return stored
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
  } catch (e) {
    // ignore
  }
  return 'light'
}

function applyTheme(theme) {
  if (theme === 'dark') document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
}

export function initTheme() {
  const theme = getInitialTheme()
  applyTheme(theme)
}

export function toggleTheme() {
  try {
    const isDark = document.documentElement.classList.contains('dark')
    const next = isDark ? 'light' : 'dark'
    applyTheme(next)
    localStorage.setItem(THEME_KEY, next)
    // dispatch an event so components can react
    window.dispatchEvent(new CustomEvent('themechange', { detail: next }))
  } catch (e) {
    // ignore
  }
}

export function currentTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

// Run immediately when imported
initTheme()
