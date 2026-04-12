import { useState } from 'react'
import { useHabits } from '../hooks/useHabits'
import { getCustomQuotes, addCustomQuote, deleteCustomQuote } from '../lib/quotes'

function Section({ title, children, surface, border, muted }) {
  return (
    <div style={{ background:surface, border:`1px solid ${border}`,
      borderRadius:8, overflow:'hidden' }}>
      <div style={{ padding:'12px 18px', borderBottom:`1px solid ${border}`,
        fontSize:9, color:muted, letterSpacing:2 }}>{title}</div>
      <div style={{ padding:'16px 18px', display:'flex', flexDirection:'column', gap:14 }}>
        {children}
      </div>
    </div>
  )
}

function Row({ label, sub, children, text, muted }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
      <div>
        <div style={{ fontSize:12, color:text }}>{label}</div>
        {sub && <div style={{ fontSize:10, color:muted, marginTop:2 }}>{sub}</div>}
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { habits, checks, groups, goals, setGoal, addGroup } = useHabits()
  const theme = document.documentElement.classList.contains('light') ? 'light' : 'dark'

  const border  = theme === 'light' ? '#e0e0d8' : '#272733'
  const surface = theme === 'light' ? '#ffffff' : '#15151a'
  const surface2= theme === 'light' ? '#f0f0ea' : '#1c1c24'
  const muted   = theme === 'light' ? '#6b6b80' : '#9191a8'
  const text    = theme === 'light' ? '#1a1a2e' : '#e6e6f0'

  const [toast,          setToast]          = useState('')
  const [newGroup,       setNewGroup]       = useState('')
  const [newQuoteText,   setNewQuoteText]   = useState('')
  const [newQuoteAuthor, setNewQuoteAuthor] = useState('')
  const [customQuotes,   setCustomQuotes]   = useState(getCustomQuotes())

  const [reminderOn,  setReminderOn]  = useState(
    JSON.parse(localStorage.getItem('ht_reminder') || '{}').enabled || false
  )
  const [reminderTime, setReminderTime] = useState(
    JSON.parse(localStorage.getItem('ht_reminder') || '{}').time || '09:00'
  )

  function toggleReminder() {
    if (reminderOn) {
      localStorage.setItem('ht_reminder', JSON.stringify({ enabled:false, time:reminderTime }))
      setReminderOn(false)
      showToast('🔕 Reminder turned off')
    } else {
      if (!('Notification' in window)) {
        showToast('❌ Browser does not support notifications')
        return
      }
      Notification.requestPermission().then(perm => {
        if (perm === 'granted') {
          localStorage.setItem('ht_reminder', JSON.stringify({ enabled:true, time:reminderTime }))
          setReminderOn(true)
          showToast(`🔔 Reminder set for ${reminderTime}!`)
          // test notification
          new Notification('✦ Habit Tracker', {
            body: "Reminder is ON! You'll get notified daily 💪",
          })
        } else {
          showToast('❌ Please allow notifications in browser settings')
        }
      })
    }
  }

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(''), 2400)
  }

  function handleAddQuote() {
    if (!newQuoteText.trim()) return
    addCustomQuote(newQuoteText.trim(), newQuoteAuthor.trim())
    setCustomQuotes(getCustomQuotes())
    setNewQuoteText('')
    setNewQuoteAuthor('')
    showToast('✓ Quote added!')
  }

  function handleDeleteQuote(index) {
    deleteCustomQuote(index)
    setCustomQuotes(getCustomQuotes())
    showToast('🗑 Quote removed')
  }

  function exportCSV() {
    const rows = [['Date','Habit','Unit','Group','Checked']]
    habits.forEach(h => {
      Object.keys(checks).forEach(key => {
        if (key.startsWith(`${h.id}_`) && checks[key]) {
          const date = key.replace(`${h.id}_`,'')
          rows.push([date, h.name, h.unit||'', h.group||'', 'yes'])
        }
      })
    })
    const csv  = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type:'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `habit-tracker-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast('✓ CSV exported!')
  }

  function clearData() {
    if (!window.confirm('Are you sure? This will delete ALL your habit data!')) return
    localStorage.removeItem('ht_habits')
    window.location.reload()
  }

  function handleAddGroup() {
    if (!newGroup.trim()) return
    addGroup(newGroup.trim())
    setNewGroup('')
    showToast(`✓ Group "${newGroup}" added!`)
  }

  const daysTracked = new Set(Object.keys(checks).map(k => k.split('_')[1])).size

  const GROUP_COLORS = ['#5af5c8','#c8f55a','#f5c85a','#f55a8c',
                        '#a78bfa','#38bdf8','#fb923c','#34d399']

  return (
    <div style={{ maxWidth:580, margin:'0 auto', display:'flex', flexDirection:'column', gap:20 }}>

      <div className='font-serif' style={{ fontSize:22, color:'#c8f55a' }}>Settings</div>

      {/* ── Goals ── */}
      <Section title='GOALS' surface={surface} border={border} muted={muted}>
        <div style={{ fontSize:10, color:muted, marginBottom:4 }}>
          Set a monthly day target for each habit
        </div>
        {habits.length === 0 && (
          <div style={{ fontSize:11, color:muted }}>No habits yet — add some from Dashboard!</div>
        )}
        {habits.map(habit => (
          <div key={habit.id} style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:text }}>{habit.name}</div>
              {habit.group && (
                <div style={{ fontSize:9, color:'#c8f55a', marginTop:2 }}>{habit.group}</div>
              )}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <input
                type='number' min='1' max='31'
                placeholder='days'
                value={goals[habit.id] || ''}
                onChange={e => setGoal(habit.id, e.target.value ? parseInt(e.target.value) : null)}
                style={{ width:60, background:surface2, border:`1px solid ${border}`,
                  borderRadius:6, padding:'4px 8px', color:text,
                  fontFamily:'DM Mono, monospace', fontSize:11, outline:'none',
                  textAlign:'center' }}
              />
              <span style={{ fontSize:10, color:muted }}>/ 31 days</span>
            </div>
            {goals[habit.id] && (
              <div style={{ fontSize:10, color:'#f5c85a' }}>
                🎯 {goals[habit.id]}d
              </div>
            )}
          </div>
        ))}
      </Section>

      {/* ── Notifications ── */}
      <Section title='NOTIFICATIONS' surface={surface} border={border} muted={muted}>
        <Row label='Daily Reminder' sub='Get a browser notification at your chosen time' text={text} muted={muted}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <input
              type='time'
              value={reminderTime}
              onChange={e => setReminderTime(e.target.value)}
              style={{ background:surface2, border:`1px solid ${border}`,
                borderRadius:6, padding:'4px 8px', color:text,
                fontFamily:'DM Mono, monospace', fontSize:11, outline:'none' }}
            />
            <button onClick={toggleReminder} style={{
              background: reminderOn ? '#f55a8c' : '#c8f55a',
              color:'#0e0e10', border:'none', borderRadius:6,
              padding:'6px 14px', fontFamily:'DM Mono, monospace',
              fontSize:10, fontWeight:700, cursor:'pointer' }}>
              {reminderOn ? 'TURN OFF' : 'ENABLE'}
            </button>
          </div>
        </Row>
        {reminderOn && (
          <div style={{ fontSize:10, color:'#5af5c8', letterSpacing:0.5 }}>
            ✓ Reminder set for {reminderTime} daily
          </div>
        )}
      </Section>

        {/* ── Custom Quotes ── */}
      <Section title='MY QUOTES' surface={surface} border={border} muted={muted}>
        <div style={{ fontSize:10, color:muted }}>Add your own quotes to the daily rotation</div>

        {/* Existing custom quotes */}
        {customQuotes.map((q, i) => (
          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8,
            padding:'8px 12px', background:surface2, borderRadius:6,
            border:`1px solid ${border}` }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:text, fontStyle:'italic' }}>"{q.text}"</div>
              <div style={{ fontSize:9, color:muted, marginTop:2 }}>— {q.author}</div>
            </div>
            <button onClick={() => handleDeleteQuote(i)} style={{
              background:'transparent', border:'none', color:muted,
              cursor:'pointer', fontSize:14, lineHeight:1, flexShrink:0 }}
              onMouseEnter={e => e.currentTarget.style.color='#f55a8c'}
              onMouseLeave={e => e.currentTarget.style.color=muted}>×</button>
          </div>
        ))}

        {/* Add new quote */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <input
            placeholder='Your quote...'
            value={newQuoteText}
            onChange={e => setNewQuoteText(e.target.value)}
            style={{ background:surface2, border:`1px solid ${border}`,
              borderRadius:6, padding:'7px 10px', color:text,
              fontFamily:'DM Mono, monospace', fontSize:11, outline:'none' }}
          />
          <div style={{ display:'flex', gap:8 }}>
            <input
              placeholder='Author (optional)'
              value={newQuoteAuthor}
              onChange={e => setNewQuoteAuthor(e.target.value)}
              onKeyDown={e => e.key==='Enter' && handleAddQuote()}
              style={{ flex:1, background:surface2, border:`1px solid ${border}`,
                borderRadius:6, padding:'7px 10px', color:text,
                fontFamily:'DM Mono, monospace', fontSize:11, outline:'none' }}
            />
            <button onClick={handleAddQuote} style={{ background:'#c8f55a', color:'#0e0e10',
              border:'none', borderRadius:6, padding:'6px 14px',
              fontFamily:'DM Mono, monospace', fontSize:10, fontWeight:700, cursor:'pointer' }}>
              ADD
            </button>
          </div>
        </div>
      </Section>

      {/* ── Groups ── */}
      <Section title='GROUPS' surface={surface} border={border} muted={muted}>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:8 }}>
          {groups.map((g, i) => (
            <div key={g} style={{ display:'flex', alignItems:'center', gap:6,
              padding:'4px 12px', borderRadius:20,
              background:`${GROUP_COLORS[i%GROUP_COLORS.length]}18`,
              border:`1px solid ${GROUP_COLORS[i%GROUP_COLORS.length]}40`,
              fontSize:11, color:GROUP_COLORS[i%GROUP_COLORS.length] }}>
              {g}
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <input
            placeholder='New group name...'
            value={newGroup}
            onChange={e => setNewGroup(e.target.value)}
            onKeyDown={e => e.key==='Enter' && handleAddGroup()}
            style={{ flex:1, background:surface2, border:`1px solid ${border}`,
              borderRadius:6, padding:'6px 10px', color:text,
              fontFamily:'DM Mono, monospace', fontSize:11, outline:'none' }}
          />
          <button onClick={handleAddGroup} style={{ background:'#c8f55a', color:'#0e0e10',
            border:'none', borderRadius:6, padding:'6px 14px',
            fontFamily:'DM Mono, monospace', fontSize:10, fontWeight:700, cursor:'pointer' }}>
            ADD
          </button>
        </div>
      </Section>

      {/* ── Data ── */}
      <Section title='DATA' surface={surface} border={border} muted={muted}>
        <Row label='Export as CSV' sub='Download all your habit completions' text={text} muted={muted}>
          <button onClick={exportCSV} style={{ background:'#c8f55a', color:'#0e0e10',
            border:'none', borderRadius:6, padding:'6px 14px',
            fontFamily:'DM Mono, monospace', fontSize:10, fontWeight:700, cursor:'pointer' }}>
            EXPORT
          </button>
        </Row>
        <Row label='Clear all data' sub='Permanently delete all habits and completions' text={text} muted={muted}>
          <button onClick={clearData} style={{ background:'transparent', color:'#f55a8c',
            border:'1px solid #f55a8c', borderRadius:6, padding:'6px 14px',
            fontFamily:'DM Mono, monospace', fontSize:10, cursor:'pointer' }}>
            CLEAR
          </button>
        </Row>
      </Section>

      {/* ── About ── */}
      <Section title='ABOUT' surface={surface} border={border} muted={muted}>
        <Row label='Version' sub='Current build' text={text} muted={muted}>
          <span style={{ fontSize:11, color:muted }}>1.0.0</span>
        </Row>
        <Row label='Storage' sub='Where your data lives' text={text} muted={muted}>
          <span style={{ fontSize:11, color:'#5af5c8' }}>localStorage</span>
        </Row>
        <Row label='Habits' sub='Total habits created' text={text} muted={muted}>
          <span style={{ fontSize:11, color:'#c8f55a' }}>{habits.length}</span>
        </Row>
        <Row label='Groups' sub='Total groups' text={text} muted={muted}>
          <span style={{ fontSize:11, color:'#f5c85a' }}>{groups.length}</span>
        </Row>
        <Row label='Days tracked' sub='Total days with any completion' text={text} muted={muted}>
          <span style={{ fontSize:11, color:'#f55a8c' }}>{daysTracked}</span>
        </Row>
      </Section>

      {toast && (
        <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)',
          background:surface2, border:`1px solid ${border}`,
          borderRadius:8, padding:'8px 20px', fontSize:11, color:text, zIndex:9999 }}>
          {toast}
        </div>
      )}

    </div>
  )
}