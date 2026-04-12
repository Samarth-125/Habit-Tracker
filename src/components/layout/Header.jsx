import { useLocation } from 'react-router-dom'

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']

const PAGE_NAMES = {
  '/':         'Dashboard',
  '/stats':    'Stats',
  '/settings': 'Settings',
  '/profile':  'Profile',
}

export default function Header({ theme, toggleTheme }) {
  const bg     = theme === 'light' ? '#ffffff' : '#15151a'
  const border = theme === 'light' ? '#e0e0d8' : '#272733'
  const muted  = theme === 'light' ? '#6b6b80' : '#9191a8'
  const text   = theme === 'light' ? '#1a1a2e' : '#e6e6f0'

  const location = useLocation()
  const pageName = PAGE_NAMES[location.pathname] || 'Habit Tracker'

  const now   = new Date()
  const label = `${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`

  return (
    <div
      style={{
        height: 56, background: bg,
        borderBottom: `1px solid ${border}`,
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px', flexShrink: 0,
      }}>

      {/* Left — logo + page name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div className='font-serif' style={{ fontSize: 20, color: '#c8f55a' }}>
          ✦
        </div>
        <div style={{ width: 1, height: 20, background: border }} />
        <div className='font-serif' style={{ fontSize: 16, color: text }}>
          {pageName}
        </div>
      </div>

      {/* Right — date + theme toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Date — hidden on mobile */}
        <div
          className='hide-mobile'
          style={{ fontSize: 11, color: muted, letterSpacing: 1 }}>
          {label}
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: 34, height: 34,
            background: theme === 'light' ? '#f0f0ea' : '#1c1c24',
            border: `1px solid ${border}`,
            borderRadius: 8, fontSize: 16,
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

    </div>
  )
}