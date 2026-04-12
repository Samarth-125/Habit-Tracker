import { useHabits } from '../hooks/useHabits'
import { useStreak } from '../hooks/useStreak'

// ── Streak card per habit ──
function StreakCard({ habit, checks, theme }) {
  const border  = theme === 'light' ? '#e0e0d8' : '#272733'
  const surface = theme === 'light' ? '#ffffff' : '#15151a'
  const muted   = theme === 'light' ? '#6b6b80' : '#9191a8'
  const text    = theme === 'light' ? '#1a1a2e' : '#e6e6f0'

  const { getStreak, getBestStreak, getRate } = useStreak(habit.id, checks)
  const streak = getStreak()
  const best   = getBestStreak()
  const rate   = getRate()

  return (
    <div style={{
      background: surface,
      border: `1px solid ${border}`,
      borderRadius: 8,
      padding: '16px 18px',
    }}>
      {/* Habit name */}
      <div style={{ fontSize: 13, color: text, marginBottom: 12 }}>
        {habit.name}
        {habit.unit && (
          <span style={{ fontSize: 10, color: '#5af5c8', marginLeft: 8 }}>
            {habit.unit}
          </span>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'STREAK',  value: `${streak}d`, color: '#c8f55a' },
          { label: 'BEST',    value: `${best}d`,   color: '#f5c85a' },
          { label: '30 DAYS', value: `${rate}%`,   color: '#5af5c8' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            flex: 1,
            background: theme === 'light' ? '#f0f0ea' : '#1c1c24',
            border: `1px solid ${border}`,
            borderRadius: 6,
            padding: '8px 10px',
          }}>
            <div style={{ fontSize: 8, color: muted, letterSpacing: 2, marginBottom: 4 }}>
              {label}
            </div>
            <div className='font-serif' style={{ fontSize: 20, color }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Completion bar */}
      <div style={{ marginTop: 12 }}>
        <div style={{
          height: 4, background: border, borderRadius: 2, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${rate}%`,
            background: '#c8f55a',
            borderRadius: 2,
            transition: 'width 0.6s cubic-bezier(.34,1.4,.64,1)',
          }} />
        </div>
        <div style={{ fontSize: 9, color: muted, marginTop: 4, letterSpacing: 1 }}>
          {rate}% completion last 30 days
        </div>
      </div>
    </div>
  )
}

// ── Heatmap ──
function Heatmap({ habits, checks, theme }) {
  const border  = theme === 'light' ? '#e0e0d8' : '#272733'
  const surface = theme === 'light' ? '#ffffff' : '#15151a'
  const muted   = theme === 'light' ? '#6b6b80' : '#9191a8'

  const WEEKS = 26 // 6 months
  const DAYS  = 7
  const today = new Date()

  // build grid — each cell = one day
  const cells = []
  for (let w = WEEKS - 1; w >= 0; w--) {
    for (let d = 0; d < DAYS; d++) {
      const date = new Date(today)
      date.setDate(today.getDate() - (w * 7 + (6 - d)))
      const dateStr = date.toISOString().split('T')[0]
      const count   = habits.filter(h => !!checks[`${h.id}_${dateStr}`]).length
      const total   = habits.length
      const ratio   = total > 0 ? count / total : 0
      cells.push({ dateStr, count, total, ratio })
    }
  }

  function cellColor(ratio, isToday) {
    if (isToday) return '#f55a8c'
    if (ratio === 0)   return theme === 'light' ? '#e0e0d8' : '#1c1c24'
    if (ratio <= 0.33) return '#5af5c8'
    if (ratio <= 0.66) return '#f5c85a'
    return '#c8f55a'
  }

  const todayStr = today.toISOString().split('T')[0]

  return (
    <div style={{
      background: surface,
      border: `1px solid ${border}`,
      borderRadius: 8,
      padding: '18px 18px',
      overflowX: 'auto',
    }}>
      <div style={{ fontSize: 9, color: muted, letterSpacing: 2, marginBottom: 14 }}>
        ACTIVITY — LAST 6 MONTHS
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${WEEKS}, 14px)`,
        gridTemplateRows: `repeat(${DAYS}, 14px)`,
        gap: 3,
        width: 'fit-content',
      }}>
        {cells.map(({ dateStr, count, total, ratio }) => (
          <div
            key={dateStr}
            title={`${dateStr} — ${count}/${total} habits`}
            style={{
              width: 14, height: 14,
              borderRadius: 3,
              background: cellColor(ratio, dateStr === todayStr),
              cursor: 'default',
              transition: 'transform 0.1s',
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.3)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 12 }}>
        <span style={{ fontSize: 8, color: muted }}>LESS</span>
        {['#1c1c24', '#5af5c8', '#f5c85a', '#c8f55a'].map(c => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: 2, background: c }} />
        ))}
        <span style={{ fontSize: 8, color: muted }}>MORE</span>
        <div style={{ width: 10, height: 10, borderRadius: 2, background: '#f55a8c' }} />
        <span style={{ fontSize: 8, color: muted }}>TODAY</span>
      </div>
    </div>
  )
}

// ── Bar Chart — last 30 days ──
function BarChart({ habits, checks, theme }) {
  const border  = theme === 'light' ? '#e0e0d8' : '#272733'
  const surface = theme === 'light' ? '#ffffff' : '#15151a'
  const muted   = theme === 'light' ? '#6b6b80' : '#9191a8'

  const today = new Date()
  const days  = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - (29 - i))
    const dateStr = d.toISOString().split('T')[0]
    const count   = habits.filter(h => !!checks[`${h.id}_${dateStr}`]).length
    return { dateStr, count, label: d.getDate() }
  })

  const max     = Math.max(...days.map(d => d.count), 1)
  const todayStr = today.toISOString().split('T')[0]

  return (
    <div style={{
      background: surface,
      border: `1px solid ${border}`,
      borderRadius: 8,
      padding: '18px 18px',
    }}>
      <div style={{ fontSize: 9, color: muted, letterSpacing: 2, marginBottom: 14 }}>
        DAILY COMPLETIONS — LAST 30 DAYS
      </div>

      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 4,
        height: 100,
      }}>
        {days.map(({ dateStr, count, label }) => {
          const isToday = dateStr === todayStr
          const h = count > 0 ? Math.max(Math.round((count / max) * 100), 4) : 0
          return (
            <div
              key={dateStr}
              title={`${dateStr}: ${count} habits`}
              style={{
                flex: 1, display: 'flex',
                flexDirection: 'column', alignItems: 'center',
                justifyContent: 'flex-end', gap: 4, height: '100%',
              }}>
              <div style={{
                width: '100%',
                height: h + '%',
                background: isToday ? '#f55a8c' : count === 0 ? border : '#c8f55a',
                borderRadius: '3px 3px 0 0',
                transition: 'height 0.4s cubic-bezier(.34,1.4,.64,1)',
                opacity: isToday ? 1 : 0.8,
              }} />
              {label % 5 === 0 && (
                <div style={{ fontSize: 7, color: muted }}>{label}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Stats page ──
export default function Stats() {
  const { habits, checks } = useHabits()
  const theme = document.documentElement.classList.contains('light') ? 'light' : 'dark'
  const muted = theme === 'light' ? '#6b6b80' : '#9191a8'

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Heatmap */}
      <Heatmap habits={habits} checks={checks} theme={theme} />

      {/* Bar chart */}
      <BarChart habits={habits} checks={checks} theme={theme} />

      {/* Streak cards */}
      <div style={{ fontSize: 11, color: muted, letterSpacing: 2 }}>
        PER HABIT STREAKS
      </div>

      {habits.length === 0 && (
        <div style={{ color: muted, fontSize: 12, textAlign: 'center', padding: '40px 0' }}>
          No habits yet — add some from the Dashboard!
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {habits.map(habit => (
          <StreakCard
            key={habit.id}
            habit={habit}
            checks={checks}
            theme={theme}
          />
        ))}
      </div>

    </div>
  )
}