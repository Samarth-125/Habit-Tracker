import { NavLink } from 'react-router-dom'

const links = [
  { to: '/',         icon: '⊞', label: 'Dashboard' },
  { to: '/stats',    icon: '◎', label: 'Stats'      },
  { to: '/settings', icon: '⚙', label: 'Settings'  },
  { to: '/profile',  icon: '◉', label: 'Profile'   },
]

export default function Sidebar({ theme }) {
  const bg     = theme === 'light' ? '#ffffff' : '#15151a'
  const border = theme === 'light' ? '#e0e0d8' : '#272733'
  const muted  = theme === 'light' ? '#6b6b80' : '#9191a8'

  return (
    <>
      {/* ── DESKTOP sidebar (left) ── */}
      <div
        className='desktop-sidebar'
        style={{
          width: 64, background: bg,
          borderRight: `1px solid ${border}`,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', padding: '24px 0', gap: 8,
          flexShrink: 0,
        }}>

        {/* Logo */}
        <div className='font-serif' style={{ fontSize: 20, color: '#c8f55a', marginBottom: 20 }}>
          ✦
        </div>

        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            title={label}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 4, width: 48, height: 48, borderRadius: 8,
              textDecoration: 'none',
              background: isActive ? 'rgba(200,245,90,0.12)' : 'transparent',
              color:      isActive ? '#c8f55a' : muted,
              border:     isActive ? '1px solid rgba(200,245,90,0.3)' : '1px solid transparent',
              transition: 'all 0.15s',
            })}>
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{ fontSize: 7, letterSpacing: 1 }}>{label.toUpperCase()}</span>
          </NavLink>
        ))}
      </div>

      {/* ── MOBILE bottom nav ── */}
      <div
        className='mobile-nav'
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          height: 60, background: bg,
          borderTop: `1px solid ${border}`,
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-around',
          zIndex: 100,
        }}>
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3,
              textDecoration: 'none',
              color: isActive ? '#c8f55a' : muted,
              padding: '6px 16px', borderRadius: 8,
              transition: 'all 0.15s',
            })}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontSize: 8, letterSpacing: 1 }}>{label.toUpperCase()}</span>
          </NavLink>
        ))}
      </div>
    </>
  )
}