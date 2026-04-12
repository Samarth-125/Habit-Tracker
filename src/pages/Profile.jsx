import { useHabits } from '../hooks/useHabits'
import { useStreak } from '../hooks/useStreak'

export default function Profile() {
  const { habits, checks } = useHabits()
  const theme = document.documentElement.classList.contains('light') ? 'light' : 'dark'

  const border  = theme === 'light' ? '#e0e0d8' : '#272733'
  const surface = theme === 'light' ? '#ffffff' : '#15151a'
  const muted   = theme === 'light' ? '#6b6b80' : '#9191a8'
  const text    = theme === 'light' ? '#1a1a2e' : '#e6e6f0'

  const today = new Date().toISOString().split('T')[0]

  // overall stats
  const doneToday  = habits.filter(h => !!checks[`${h.id}_${today}`]).length
  const totalDays  = new Set(Object.keys(checks).map(k => k.split('_')[1])).size
  const totalDone  = Object.values(checks).filter(Boolean).length

  // best habit — most completions
  const bestHabit = habits.reduce((best, h) => {
    const count = Object.keys(checks).filter(k => k.startsWith(`${h.id}_`) && checks[k]).length
    return count > (best.count || 0) ? { ...h, count } : best
  }, {})

  return (
    <div style={{ maxWidth: 580, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Avatar + name ── */}
      <div style={{
        background: surface,
        border: `1px solid ${border}`,
        borderRadius: 8,
        padding: '28px 24px',
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        {/* Avatar circle */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(200,245,90,0.15)',
          border: '2px solid #c8f55a',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, flexShrink: 0,
        }}>
          🧑
        </div>
        <div>
          <div className='font-serif' style={{ fontSize: 22, color: '#c8f55a', marginBottom: 4 }}>
            My Profile
          </div>
          <div style={{ fontSize: 10, color: muted, letterSpacing: 1 }}>
            HABIT TRACKER — LOCAL MODE
          </div>
        </div>
      </div>

      {/* ── Overall stats ── */}
      <div style={{
        fontSize: 9, color: muted, letterSpacing: 2, marginBottom: -10,
      }}>
        OVERALL STATS
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { label: 'DONE TODAY',   value: `${doneToday}/${habits.length}`, color: '#c8f55a' },
          { label: 'TOTAL HABITS', value: habits.length,                    color: '#f5c85a' },
          { label: 'DAYS TRACKED', value: totalDays,                        color: '#5af5c8' },
          { label: 'TOTAL DONE',   value: totalDone,                        color: '#f55a8c' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: surface,
            border: `1px solid ${border}`,
            borderRadius: 8,
            padding: '16px 18px',
          }}>
            <div style={{ fontSize: 9, color: muted, letterSpacing: 2, marginBottom: 6 }}>
              {label}
            </div>
            <div className='font-serif' style={{ fontSize: 28, color }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* ── Best habit ── */}
      {bestHabit.name && (
        <>
          <div style={{ fontSize: 9, color: muted, letterSpacing: 2, marginBottom: -10 }}>
            BEST HABIT
          </div>
          <div style={{
            background: surface,
            border: `1px solid ${border}`,
            borderRadius: 8,
            padding: '16px 18px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 13, color: text }}>{bestHabit.name}</div>
              <div style={{ fontSize: 10, color: muted, marginTop: 4 }}>
                most consistent habit
              </div>
            </div>
            <div style={{
              background: 'rgba(200,245,90,0.1)',
              border: '1px solid rgba(200,245,90,0.3)',
              borderRadius: 20, padding: '4px 14px',
              fontSize: 12, color: '#c8f55a',
            }}>
              {bestHabit.count} days ✓
            </div>
          </div>
        </>
      )}

      {/* ── Per habit overview ── */}
      <div style={{ fontSize: 9, color: muted, letterSpacing: 2, marginBottom: -10 }}>
        ALL HABITS
      </div>

      {habits.map(habit => {
        const count = Object.keys(checks)
          .filter(k => k.startsWith(`${habit.id}_`) && checks[k]).length
        const pct = totalDays > 0 ? Math.round((count / totalDays) * 100) : 0

        return (
          <div key={habit.id} style={{
            background: surface,
            border: `1px solid ${border}`,
            borderRadius: 8,
            padding: '14px 18px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 12, color: text }}>{habit.name}</div>
              <div style={{ fontSize: 11, color: '#c8f55a' }}>{count} days</div>
            </div>
            <div style={{ height: 4, background: border, borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${pct}%`,
                background: '#c8f55a', borderRadius: 2,
                transition: 'width 0.6s cubic-bezier(.34,1.4,.64,1)',
              }} />
            </div>
          </div>
        )
      })}

      {habits.length === 0 && (
        <div style={{ color: muted, fontSize: 12, textAlign: 'center', padding: '40px 0' }}>
          No habits yet — add some from the Dashboard!
        </div>
      )}

    </div>
  )
}