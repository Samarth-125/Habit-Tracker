import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useTheme } from '../../hooks/useTheme'

export default function AppLayout() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div
      className={theme === 'light' ? 'light' : ''}
      style={{
        display: 'flex', height: '100vh', overflow: 'hidden',
        background: theme === 'light' ? '#f5f5f0' : '#0e0e10',
      }}>

      {/* Sidebar — hidden on mobile */}
      <Sidebar theme={theme} />

      {/* Main area */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        <Header theme={theme} toggleTheme={toggleTheme} />

        {/* Page content — extra bottom padding on mobile for bottom nav */}
        <main style={{
          flex: 1, overflowY: 'auto',
          padding: '24px 16px',
          paddingBottom: 80,
        }}>
          <Outlet context={{ theme }} />
        </main>
      </div>

    </div>
  )
}