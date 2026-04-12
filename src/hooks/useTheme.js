import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(
    localStorage.getItem('ht_theme') || 'dark'
  )

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
      root.classList.remove('light')
    }
    localStorage.setItem('ht_theme', theme)
  }, [theme])

  // Apply theme immediately on first load
  useEffect(() => {
    const saved = localStorage.getItem('ht_theme') || 'dark'
    const root  = document.documentElement
    if (saved === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
      root.classList.remove('light')
    }
  }, [])

  function toggleTheme() {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return { theme, toggleTheme }
}