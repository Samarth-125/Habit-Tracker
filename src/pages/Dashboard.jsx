import { useState, useEffect, useRef } from 'react'
import { useHabits } from '../hooks/useHabits'
import { useStreak } from '../hooks/useStreak'
import Toast from '../components/ui/Toast'
import { getDailyQuote } from '../lib/quotes'
import confetti from 'canvas-confetti'

const TODAY  = new Date()
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const GROUP_COLORS = [
  '#5af5c8','#c8f55a','#f5c85a','#f55a8c',
  '#a78bfa','#38bdf8','#fb923c','#34d399',
]

function getGroupColor(group, groups) {
  const idx = groups.indexOf(group)
  return GROUP_COLORS[idx % GROUP_COLORS.length] || '#9191a8'
}

function fireConfetti() {
  confetti({ particleCount:120, spread:80, origin:{ y:0.6 },
    colors:['#c8f55a','#5af5c8','#f55a8c','#f5c85a','#a78bfa'] })
  setTimeout(() => confetti({ particleCount:80, angle:60, spread:60,
    origin:{ x:0, y:0.6 }, colors:['#c8f55a','#5af5c8','#f55a8c'] }), 200)
  setTimeout(() => confetti({ particleCount:80, angle:120, spread:60,
    origin:{ x:1, y:0.6 }, colors:['#c8f55a','#5af5c8','#f55a8c'] }), 400)
}

// ── Count Up ──
function CountUp({ value, style, className }) {
  const [display, setDisplay] = useState('0')
  const prevRef = useRef(null)

  useEffect(() => {
    if (typeof value === 'string' && (value.includes('/') || value.includes('%'))) {
      setDisplay(value)
      return
    }
    const end   = parseInt(value) || 0
    const start = parseInt(prevRef.current) || 0
    if (start === end) { setDisplay(String(value)); return }
    let frame = 0
    const total = 20
    const timer = setInterval(() => {
      frame++
      const progress = frame / total
      const current  = Math.round(start + (end - start) * progress)
      setDisplay(String(current))
      if (frame >= total) { clearInterval(timer); setDisplay(String(value)) }
    }, 16)
    prevRef.current = value
    return () => clearInterval(timer)
  }, [value])

  return <div className={className} style={style}>{display}</div>
}

// ── Quote Bar ──
function QuoteBar({ theme }) {
  const quote   = getDailyQuote()
  const border  = theme === 'light' ? '#e0e0d8' : '#272733'
  const surface = theme === 'light' ? '#ffffff' : '#15151a'
  const muted   = theme === 'light' ? '#6b6b80' : '#9191a8'
  const text    = theme === 'light' ? '#1a1a2e' : '#e6e6f0'

  return (
    <div className='quote-anim' style={{
      display:'flex', alignItems:'center', gap:16,
      padding:'12px 18px', background:surface,
      border:`1px solid ${border}`, borderLeft:'3px solid #c8f55a',
      borderRadius:8, marginBottom:20,
    }}>
      <div style={{ fontSize:18, flexShrink:0 }}>✦</div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:12, color:text, fontStyle:'italic', lineHeight:1.5 }}>
          "{quote.text}"
        </div>
        <div style={{ fontSize:10, color:muted, marginTop:4, letterSpacing:1 }}>
          — {quote.author}
        </div>
      </div>
    </div>
  )
}

// ── Progress Ring ──
function ProgressRing({ pct, color='#c8f55a', size=28 }) {
  const r      = (size - 4) / 2
  const circ   = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <svg width={size} height={size} style={{ flexShrink:0 }}>
      <circle cx={size/2} cy={size/2} r={r}
        fill='none' stroke='#272733' strokeWidth='3' />
      <circle cx={size/2} cy={size/2} r={r}
        fill='none' stroke={color} strokeWidth='3'
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap='round'
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition:'stroke-dashoffset 0.6s cubic-bezier(.34,1.4,.64,1)' }}
      />
      <text x={size/2} y={size/2+4} textAnchor='middle'
        fontSize='8' fill={color}
        fontFamily='DM Mono, monospace' fontWeight='500'>
        {pct}%
      </text>
    </svg>
  )
}

// ── Mini Chart ──
function MiniChart({ habit, checks, year, month, daysInMonth, chartType, theme }) {
  const border  = theme === 'light' ? '#e0e0d8' : '#272733'
  const surface = theme === 'light' ? '#ffffff' : '#15151a'
  const CHART_H = 80
  const COLORS  = ['#5af5c8','#c8f55a','#f5c85a','#f55a8c','#a78bfa',
                   '#38bdf8','#fb923c','#34d399','#e879f9','#fbbf24']
  const color   = COLORS[habit.id % COLORS.length] || '#c8f55a'

  function dateStr(d) {
    return `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
  }

  const vals = Array.from({ length:daysInMonth }, (_,i) =>
    checks[`${habit.id}_${dateStr(i+1)}`] ? 1 : 0
  )
  const max = Math.max(...vals, 1)

  if (chartType === 'bar') return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:2, height:CHART_H, padding:'8px 0' }}>
      {vals.map((v,i) => (
        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'flex-end', height:'100%' }}>
          <div style={{ width:'100%', borderRadius:'2px 2px 0 0',
            height: v>0 ? `${Math.max((v/max)*100,8)}%` : '2px',
            background: v>0 ? color : border,
            transition:'height 0.3s cubic-bezier(.34,1.4,.64,1)' }} />
        </div>
      ))}
    </div>
  )

  if (chartType === 'line') {
    const W   = daysInMonth * 20
    const H   = CHART_H
    const pts = vals.map((v,i) => ({
      x: (i / Math.max(daysInMonth-1,1)) * W,
      y: H - (max>0 ? (v/max)*H*0.85 : 0) - 8,
    }))
    const linePath = pts.map((p,i) => `${i===0?'M':'L'}${p.x},${p.y}`).join(' ')
    const areaPath = `M${pts[0].x},${H} ${linePath} L${pts[pts.length-1].x},${H} Z`
    return (
      <div style={{ height:CHART_H, overflow:'hidden' }}>
        <svg width='100%' height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio='none'>
          <path d={areaPath} fill={color+'18'} />
          <path d={linePath} fill='none' stroke={color} strokeWidth='2' strokeLinejoin='round' />
          {pts.map((p,i) => vals[i]>0 && (
            <circle key={i} cx={p.x} cy={p.y} r='3'
              fill={color} stroke={surface} strokeWidth='1.5' />
          ))}
        </svg>
      </div>
    )
  }

  if (chartType === 'heat') return (
    <div style={{ display:'flex', gap:3, flexWrap:'wrap', padding:'8px 0' }}>
      {vals.map((v,i) => (
        <div key={i} title={`Day ${i+1}: ${v>0?'✓ done':'✗ missed'}`}
          style={{ width:14, height:14, borderRadius:3,
            background: v>0 ? color : border,
            opacity: v>0 ? 1 : 0.4,
            transition:'transform 0.1s', cursor:'default' }}
          onMouseEnter={e => e.target.style.transform='scale(1.3)'}
          onMouseLeave={e => e.target.style.transform='scale(1)'} />
      ))}
    </div>
  )

  return null
}

// ── Grid View ──
function GridView({ habits, checks, toggleCheck, deleteHabit, updateHabit, addHabit, theme, groups }) {
  const [year,      setYear]      = useState(TODAY.getFullYear())
  const [month,     setMonth]     = useState(TODAY.getMonth())
  const [chartType, setChartType] = useState('bar')

  const border  = theme === 'light' ? '#e0e0d8' : '#272733'
  const surface = theme === 'light' ? '#ffffff' : '#15151a'
  const surface2= theme === 'light' ? '#f0f0ea' : '#1c1c24'
  const muted   = theme === 'light' ? '#6b6b80' : '#9191a8'
  const text    = theme === 'light' ? '#1a1a2e' : '#e6e6f0'

  const daysInMonth = new Date(year, month+1, 0).getDate()
  const days = Array.from({ length:daysInMonth }, (_,i) => i+1)

  function isToday(d) {
    return year===TODAY.getFullYear() && month===TODAY.getMonth() && d===TODAY.getDate()
  }
  function isWeekend(d) { return [0,6].includes(new Date(year,month,d).getDay()) }
  function dateStr(d) {
    return `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
  }
  function prevMonth() { if(month===0){setMonth(11);setYear(y=>y-1)}else setMonth(m=>m-1) }
  function nextMonth() { if(month===11){setMonth(0);setYear(y=>y+1)}else setMonth(m=>m+1) }

  return (
    <div style={{ overflowX:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button onClick={prevMonth} style={{ width:28, height:28, borderRadius:6,
            border:`1px solid ${border}`, background:surface2, color:text, cursor:'pointer', fontSize:13 }}>←</button>
          <div className='font-serif' style={{ fontSize:16, color:text, minWidth:160, textAlign:'center' }}>
            {MONTHS[month]} {year}
          </div>
          <button onClick={nextMonth} style={{ width:28, height:28, borderRadius:6,
            border:`1px solid ${border}`, background:surface2, color:text, cursor:'pointer', fontSize:13 }}>→</button>
        </div>
        <div style={{ display:'flex', background:surface2, border:`1px solid ${border}`,
          borderRadius:6, overflow:'hidden' }}>
          {['bar','line','heat'].map(t => (
            <button key={t} onClick={() => setChartType(t)} style={{
              padding:'4px 12px', fontFamily:'DM Mono, monospace',
              fontSize:9, letterSpacing:1, cursor:'pointer', border:'none',
              background: chartType===t ? '#c8f55a' : 'transparent',
              color: chartType===t ? '#0e0e10' : muted, transition:'all 0.15s',
            }}>{t.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', minWidth:'max-content' }}>
        <div style={{ display:'flex' }}>
          <div style={{ width:180, minWidth:180, flexShrink:0,
            borderBottom:`1px solid ${border}`, padding:'6px 10px',
            fontSize:9, color:muted, letterSpacing:2 }}>MY HABITS</div>
          {days.map(d => (
            <div key={d} style={{ width:36, minWidth:36, flexShrink:0,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              padding:'4px 0', borderBottom:`1px solid ${border}`, borderLeft:`1px solid ${border}`,
              background: isToday(d) ? '#c8f55a' : 'transparent' }}>
              <div style={{ fontSize:7, color:isToday(d)?'#0e0e10':muted, letterSpacing:1 }}>
                {DAYS[new Date(year,month,d).getDay()].toUpperCase()}
              </div>
              <div style={{ fontSize:11, color:isToday(d)?'#0e0e10':isWeekend(d)?'#f55a8c':text }}>
                {d}
              </div>
            </div>
          ))}
        </div>

        {habits.map((habit,i) => (
          <div key={habit.id} style={{ display:'flex' }}>
            <div style={{ width:180, minWidth:180, flexShrink:0,
              borderBottom:`1px solid ${border}`, background:surface,
              position:'sticky', left:0, zIndex:10,
              display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 10px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:9, color:muted, minWidth:14 }}>{i+1}</span>
                <span style={{ fontSize:12, color:text }}>{habit.name}</span>
                <button onClick={() => deleteHabit(habit.id)} style={{
                  marginLeft:'auto', background:'transparent', border:'none',
                  color:muted, fontSize:14, cursor:'pointer', lineHeight:1, transition:'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color='#f55a8c'}
                  onMouseLeave={e => e.currentTarget.style.color=muted}>×</button>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
                {habit.unit && <span style={{ fontSize:9, color:'#5af5c8' }}>{habit.unit}</span>}
                {habit.group && (
                  <span style={{ fontSize:7, letterSpacing:1, padding:'1px 5px',
                    borderRadius:8, background:'rgba(200,245,90,0.1)',
                    border:'1px solid rgba(200,245,90,0.2)', color:'#c8f55a' }}>
                    {habit.group}
                  </span>
                )}
              </div>
            </div>
            {days.map(d => {
              const key     = `${habit.id}_${dateStr(d)}`
              const checked = !!checks[key]
              return (
                <div key={d} onClick={() => toggleCheck(habit.id, dateStr(d))}
                  style={{ width:36, minWidth:36, flexShrink:0, height:52,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    borderLeft:`1px solid ${border}`, borderBottom:`1px solid ${border}`,
                    background:isToday(d)?'rgba(200,245,90,0.05)':'transparent',
                    cursor:'pointer', transition:'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background=surface2}
                  onMouseLeave={e => e.currentTarget.style.background=isToday(d)?'rgba(200,245,90,0.05)':'transparent'}>
                  <div style={{ width:13, height:13, borderRadius:3,
                    border:checked?'none':`1.5px solid ${border}`,
                    background:checked?'#c8f55a':'transparent', transition:'all 0.12s',
                    display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {checked && <span style={{ fontSize:8, color:'#0e0e10', fontWeight:700 }}>✓</span>}
                  </div>
                </div>
              )
            })}
          </div>
        ))}

        <div style={{ display:'flex' }}>
          <div style={{ width:180, minWidth:180, padding:'8px 10px',
            borderBottom:`1px dashed ${border}`, background:surface, position:'sticky', left:0 }}>
            <AddHabitInline onAdd={addHabit} theme={theme} habits={habits} />
          </div>
          {days.map(d => (
            <div key={d} style={{ width:36, minWidth:36, flexShrink:0,
              borderLeft:`1px solid ${border}`, borderBottom:`1px dashed ${border}`,
              background:surface }} />
          ))}
        </div>
      </div>

      {habits.length > 0 && (
        <div style={{ marginTop:24 }}>
          <div style={{ fontSize:9, color:muted, letterSpacing:2, marginBottom:12 }}>
            HABIT CHARTS — {chartType.toUpperCase()}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {habits.map(habit => (
              <div key={habit.id} style={{ background:surface,
                border:`1px solid ${border}`, borderRadius:8, padding:'10px 14px' }}>
                <div style={{ fontSize:11, color:text, marginBottom:6 }}>
                  {habit.name}
                  {habit.unit && <span style={{ fontSize:9, color:'#5af5c8', marginLeft:8 }}>{habit.unit}</span>}
                </div>
                <MiniChart habit={habit} checks={checks} year={year} month={month}
                  daysInMonth={daysInMonth} chartType={chartType} theme={theme} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display:'flex', marginTop:24, gap:12,
        borderTop:`2px solid ${border}`, paddingTop:16 }}>
        {(() => {
          const total      = habits.length
          const todayD     = TODAY.getDate()
          const doneToday  = habits.filter(h => !!checks[`${h.id}_${dateStr(todayD)}`]).length
          const monthTotal = Object.keys(checks).filter(k => {
            const d = k.split('_')[1]
            return d && d.startsWith(`${year}-${String(month+1).padStart(2,'0')}`) && checks[k]
          }).length
          const pct = daysInMonth>0&&total>0 ? Math.round((monthTotal/(daysInMonth*total))*100) : 0
          return [
            { label:'MONTH TOTAL', value:monthTotal,              sub:'habits done', color:'#c8f55a' },
            { label:'TODAY',       value:`${doneToday}/${total}`, sub:'done today',  color:'#5af5c8' },
            { label:'COMPLETION',  value:`${pct}%`,               sub:'this month',  color:'#f5c85a' },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className='stat-card-anim' style={{ flex:1, padding:'12px 16px',
              background:surface, border:`1px solid ${border}`, borderRadius:8 }}>
              <div style={{ fontSize:9, color:muted, letterSpacing:2, marginBottom:4 }}>{label}</div>
              <div className='font-serif' style={{ fontSize:24, color, lineHeight:1 }}>{value}</div>
              <div style={{ fontSize:9, color:muted, marginTop:2 }}>{sub}</div>
            </div>
          ))
        })()}
      </div>
    </div>
  )
}

// ── Inline Add Habit ──
function AddHabitInline({ onAdd, theme, habits }) {
  const [name, setName] = useState('')
  const muted = theme === 'light' ? '#6b6b80' : '#9191a8'
  const text  = theme === 'light' ? '#1a1a2e' : '#e6e6f0'
  return (
    <input
      placeholder={`+ ADD HABIT  ${habits.length}/20`}
      value={name} onChange={e => setName(e.target.value)}
      onKeyDown={e => { if(e.key==='Enter'&&name.trim()){ onAdd(name.trim(),'','Personal'); setName('') } }}
      style={{ background:'transparent', border:'none', outline:'none',
        color:name?text:muted, fontFamily:'DM Mono, monospace',
        fontSize:10, letterSpacing:1, width:'100%', cursor:'pointer' }}
    />
  )
}

// ── Add Habit Form ──
function AddHabitForm({ onAdd, theme, onCancel, groups }) {
  const [name,  setName]  = useState('')
  const [unit,  setUnit]  = useState('')
  const [group, setGroup] = useState(groups[0] || 'Personal')
  const border  = theme === 'light' ? '#e0e0d8' : '#272733'
  const surface = theme === 'light' ? '#f0f0ea' : '#1c1c24'
  const text    = theme === 'light' ? '#1a1a2e' : '#e6e6f0'

  function handleSubmit() {
    if (!name.trim()) return
    onAdd(name.trim(), unit.trim(), group)
    setName(''); setUnit('')
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8, padding:'12px 16px',
      background:surface, border:`1px dashed ${border}`, borderRadius:8, marginBottom:8 }}>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <input autoFocus placeholder='Habit name...' value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key==='Enter' && handleSubmit()}
          style={{ flex:2, background:'transparent', border:'none', outline:'none',
            color:text, fontFamily:'DM Mono, monospace', fontSize:12 }} />
        <input placeholder='unit (optional)' value={unit}
          onChange={e => setUnit(e.target.value)}
          onKeyDown={e => e.key==='Enter' && handleSubmit()}
          style={{ flex:1, background:'transparent', border:'none', outline:'none',
            color:'#5af5c8', fontFamily:'DM Mono, monospace', fontSize:12 }} />
      </div>
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <select value={group} onChange={e => setGroup(e.target.value)}
          style={{ flex:1, background:surface, border:`1px solid ${border}`,
            borderRadius:6, padding:'4px 8px', color:text,
            fontFamily:'DM Mono, monospace', fontSize:11, outline:'none' }}>
          {groups.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <button onClick={handleSubmit} style={{ background:'#c8f55a', color:'#0e0e10',
          border:'none', borderRadius:6, padding:'5px 12px',
          fontFamily:'DM Mono, monospace', fontSize:11, fontWeight:700, cursor:'pointer' }}>ADD</button>
        <button onClick={onCancel} style={{ background:'transparent', color:'#9191a8',
          border:`1px solid ${border}`, borderRadius:6, padding:'5px 12px',
          fontFamily:'DM Mono, monospace', fontSize:11, cursor:'pointer' }}>CANCEL</button>
      </div>
    </div>
  )
}

// ── Habit Row ──
function HabitRow({ habit, checks, toggleCheck, deleteHabit, updateHabit, theme, groups, goal, index, onDragStart, onDragOver, onDrop }) {
  const border  = theme === 'light' ? '#e0e0d8' : '#272733'
  const surface = theme === 'light' ? '#ffffff' : '#15151a'
  const muted   = theme === 'light' ? '#6b6b80' : '#9191a8'
  const text    = theme === 'light' ? '#1a1a2e' : '#e6e6f0'

  const todayStr = TODAY.toISOString().split('T')[0]
  const checked  = !!checks[`${habit.id}_${todayStr}`]

  const { getStreak, getRate } = useStreak(habit.id, checks)
  const streak = getStreak()
  const rate   = getRate()

  const [editing,   setEditing]  = useState(false)
  const [editName,  setEditName] = useState(habit.name)
  const [editUnit,  setEditUnit] = useState(habit.unit)
  const [editGroup, setEditGroup]= useState(habit.group || 'Personal')
  const [highlight, setHighlight]= useState(false)
  const [shaking,   setShaking]  = useState(false)
  const [checkAnim, setCheckAnim]= useState(false)

  const groupColor = getGroupColor(habit.group, groups)

  function handleCheck() {
    toggleCheck(habit.id, todayStr)
    if (!checked) {
      setHighlight(true)
      setTimeout(() => setHighlight(false), 600)
      setCheckAnim(true)
      setTimeout(() => setCheckAnim(false), 300)
    }
  }

  function handleDelete() {
    setShaking(true)
    setTimeout(() => deleteHabit(habit.id), 400)
  }

  function saveEdit() {
    if (editName.trim()) updateHabit(habit.id, editName.trim(), editUnit.trim(), editGroup)
    setEditing(false)
  }

  return (
    <div
      className={`habit-card ${highlight ? 'row-highlight' : ''} ${shaking ? 'shake' : ''}`}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={e => { e.preventDefault(); onDragOver(index) }}
      onDrop={() => onDrop(index)}
      style={{
        display:'flex', alignItems:'center', gap:12,
        padding:'12px 16px', background:surface,
        border:`1px solid ${border}`,
        borderLeft:`3px solid ${groupColor}`,
        borderRadius:8, marginBottom:8,
        opacity: checked&&!editing ? 0.75 : 1,
        transition:'all 0.15s',
        cursor: editing ? 'default' : 'grab',
      }}>

      {!editing && (
        <div style={{ color:muted, fontSize:14, cursor:'grab', flexShrink:0, lineHeight:1 }}>⠿</div>
      )}

      <div className={checkAnim ? 'check-pop' : ''} style={{ flexShrink:0 }}>
        <input type='checkbox' checked={checked}
          onChange={handleCheck}
          style={{ width:18, height:18, accentColor:'#c8f55a', cursor:'pointer' }} />
      </div>

      <div style={{ flex:1 }}>
        {editing ? (
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <input autoFocus value={editName} onChange={e => setEditName(e.target.value)}
                onKeyDown={e => { if(e.key==='Enter') saveEdit(); if(e.key==='Escape') setEditing(false) }}
                style={{ background:'transparent', border:'none', borderBottom:'1px solid #c8f55a',
                  outline:'none', color:text, fontFamily:'DM Mono, monospace', fontSize:13, width:160 }} />
              <input value={editUnit} onChange={e => setEditUnit(e.target.value)} placeholder='unit'
                style={{ background:'transparent', border:'none', borderBottom:'1px solid #5af5c8',
                  outline:'none', color:'#5af5c8', fontFamily:'DM Mono, monospace', fontSize:11, width:60 }} />
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <select value={editGroup} onChange={e => setEditGroup(e.target.value)}
                style={{ background:surface, border:`1px solid ${border}`, borderRadius:4,
                  padding:'2px 6px', color:text, fontFamily:'DM Mono, monospace', fontSize:10, outline:'none' }}>
                {groups.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
              <button onClick={saveEdit} style={{ background:'#c8f55a', color:'#0e0e10',
                border:'none', borderRadius:4, padding:'2px 8px', fontSize:10,
                fontFamily:'DM Mono, monospace', cursor:'pointer' }}>SAVE</button>
              <button onClick={() => setEditing(false)} style={{ background:'transparent', color:muted,
                border:`1px solid ${border}`, borderRadius:4, padding:'2px 8px', fontSize:10,
                fontFamily:'DM Mono, monospace', cursor:'pointer' }}>ESC</button>
            </div>
          </div>
        ) : (
          <div onClick={() => setEditing(true)} title='Click to edit' style={{ cursor:'text' }}>
            <div style={{ fontSize:13, color:text, textDecoration:checked?'line-through':'none' }}>
              {habit.name}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
              {habit.unit && <span style={{ fontSize:10, color:'#5af5c8' }}>{habit.unit}</span>}
              <span style={{ fontSize:8, letterSpacing:1, padding:'1px 6px',
                borderRadius:10, background:`${groupColor}18`,
                border:`1px solid ${groupColor}40`, color:groupColor }}>
                {habit.group || 'Personal'}
              </span>
              {goal && (
                <span style={{ fontSize:8, color:'#f5c85a', letterSpacing:0.5 }}>
                  🎯 {goal}d goal
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {streak > 0 && !editing && (
        <div className='fire-pulse' style={{ display:'flex', alignItems:'center', gap:4,
          background:'rgba(200,245,90,0.1)', border:'1px solid rgba(200,245,90,0.3)',
          borderRadius:20, padding:'2px 10px', fontSize:11, color:'#c8f55a' }}>
          🔥 {streak}d
        </div>
      )}

      {!editing && (
        <ProgressRing pct={rate} size={28}
          color={rate===100?'#5af5c8':rate>=50?'#c8f55a':'#f55a8c'} />
      )}

      {!editing && (
        <button onClick={handleDelete}
          style={{ background:'transparent', border:'none', color:muted,
            fontSize:16, cursor:'pointer', padding:'0 4px', borderRadius:4, lineHeight:1 }}
          onMouseEnter={e => e.currentTarget.style.color='#f55a8c'}
          onMouseLeave={e => e.currentTarget.style.color=muted}>×</button>
      )}
    </div>
  )
}

// ── Card View ──
function CardView({ habits, checks, toggleCheck, addHabit, deleteHabit, updateHabit, theme, groups, goals, setGoal, reorderHabits }) {
  const [showForm, setShowForm] = useState(false)
  const [dragFrom, setDragFrom] = useState(null)
  const [dragOver, setDragOver] = useState(null)

  const border  = theme === 'light' ? '#e0e0d8' : '#272733'
  const muted   = theme === 'light' ? '#6b6b80' : '#9191a8'
  const surface = theme === 'light' ? '#ffffff' : '#15151a'

  const todayStr  = TODAY.toISOString().split('T')[0]
  const doneToday = habits.filter(h => !!checks[`${h.id}_${todayStr}`]).length
  const total     = habits.length
  const pct       = total>0 ? Math.round((doneToday/total)*100) : 0

  const grouped   = groups.reduce((acc, g) => {
    const h = habits.filter(h => (h.group||'Personal') === g)
    if (h.length > 0) acc[g] = h
    return acc
  }, {})
  const ungrouped = habits.filter(h => !h.group || !groups.includes(h.group) || !Object.keys(grouped).includes(h.group))const ungrouped = habits.filter(h => !h.group || !groups.includes(h.group))

  return (
    <div style={{ maxWidth:640, margin:'0 auto' }}>
      <div style={{ display:'flex', gap:12, marginBottom:28 }}>
        {[
          { label:'TODAY',  value:`${doneToday}/${total}`, color:'#c8f55a' },
          { label:'DONE',   value:`${pct}%`,               color:'#5af5c8' },
          { label:'HABITS', value:total,                    color:'#f5c85a' },
        ].map(({ label, value, color }) => (
          <div key={label} className='stat-card-anim' style={{ flex:1, padding:'14px 16px',
            background:surface, border:`1px solid ${border}`, borderRadius:8 }}>
            <div style={{ fontSize:9, color:muted, letterSpacing:2, marginBottom:4 }}>{label}</div>
            <CountUp className='font-serif' style={{ fontSize:26, color }} value={value} />
          </div>
        ))}
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <div style={{ fontSize:11, color:muted, letterSpacing:2 }}>TODAY'S HABITS</div>
        <button onClick={() => setShowForm(true)} style={{
          display:'flex', alignItems:'center', gap:5, background:'transparent',
          border:'1px dashed #272733', borderRadius:6, padding:'4px 12px',
          color:muted, fontFamily:'DM Mono, monospace', fontSize:10, letterSpacing:1, cursor:'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='#c8f55a'; e.currentTarget.style.color='#c8f55a' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='#272733'; e.currentTarget.style.color=muted }}>
          + ADD HABIT
        </button>
      </div>

      {showForm && (
        <AddHabitForm
          onAdd={(n,u,g) => { addHabit(n,u,g); setShowForm(false) }}
          onCancel={() => setShowForm(false)}
          theme={theme} groups={groups}
        />
      )}

      {habits.length === 0 && (
        <div style={{ color:muted, fontSize:12, textAlign:'center', padding:'40px 0' }}>
          No habits yet — add your first one! 👆
        </div>
      )}

      {Object.entries(grouped).map(([group, groupHabits]) => (
        <div key={group} style={{ marginBottom:16 }}>
          <div style={{ fontSize:9, color:getGroupColor(group, groups),
            letterSpacing:2, marginBottom:8, display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:6, height:6, borderRadius:'50%',
              background:getGroupColor(group, groups) }} />
            {group.toUpperCase()}
          </div>
          {groupHabits.map(habit => {
            const index = habits.indexOf(habit)
            return (
              <HabitRow key={habit.id} habit={habit} checks={checks}
                toggleCheck={toggleCheck} deleteHabit={deleteHabit}
                updateHabit={updateHabit} theme={theme}
                groups={groups} goal={goals[habit.id]} setGoal={setGoal}
                index={index}
                onDragStart={i => setDragFrom(i)}
                onDragOver={i => setDragOver(i)}
                onDrop={i => {
                  if (dragFrom !== null && dragFrom !== i) reorderHabits(dragFrom, i)
                  setDragFrom(null); setDragOver(null)
                }}
              />
            )
          })}
        </div>
      ))}

      {ungrouped.map(habit => {
        const index = habits.indexOf(habit)
        return (
          <HabitRow key={habit.id} habit={habit} checks={checks}
            toggleCheck={toggleCheck} deleteHabit={deleteHabit}
            updateHabit={updateHabit} theme={theme}
            groups={groups} goal={goals[habit.id]} setGoal={setGoal}
            index={index}
            onDragStart={i => setDragFrom(i)}
            onDragOver={i => setDragOver(i)}
            onDrop={i => {
              if (dragFrom !== null && dragFrom !== i) reorderHabits(dragFrom, i)
              setDragFrom(null); setDragOver(null)
            }}
          />
        )
      })}
    </div>
  )
}

// ── Main Dashboard ──
export default function Dashboard() {
  const { habits, checks, toggleCheck, addHabit, deleteHabit,
          updateHabit, groups, goals, setGoal, reorderHabits } = useHabits()
  const [view,   setView]   = useState('grid')
  const [search, setSearch] = useState('')
  const [toast,  setToast]  = useState({ show:false, message:'' })

  const theme   = document.documentElement.classList.contains('light') ? 'light' : 'dark'
  const border  = theme === 'light' ? '#e0e0d8' : '#272733'
  const muted   = theme === 'light' ? '#6b6b80' : '#9191a8'
  const surface2= theme === 'light' ? '#f0f0ea' : '#1c1c24'
  const text    = theme === 'light' ? '#1a1a2e' : '#e6e6f0'

  const filteredHabits = habits.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase())
  )

  const todayStr  = TODAY.toISOString().split('T')[0]
  const doneToday = habits.filter(h => !!checks[`${h.id}_${todayStr}`]).length
  const allDone   = habits.length > 0 && doneToday === habits.length

  const prevDone = useRef(false)
  useEffect(() => {
    if (allDone && !prevDone.current) fireConfetti()
    prevDone.current = allDone
  }, [allDone])

  function handleDelete(id) {
    deleteHabit(id)
    setToast({ show:true, message:'🗑 Habit removed' })
  }

  function handleAdd(name, unit, group) {
    addHabit(name, unit, group)
    setToast({ show:true, message:`✓ "${name}" added!` })
  }

  return (
    <div className={allDone ? 'all-done-glow' : ''}
      style={{ borderRadius:12, transition:'all 0.3s' }}>

      <QuoteBar theme={theme} />

      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:8,
          background:surface2, border:`1px solid ${border}`,
          borderRadius:6, padding:'5px 12px' }}>
          <span style={{ fontSize:12, color:muted }}>⌕</span>
          <input placeholder='Search habits...' value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ background:'transparent', border:'none', outline:'none',
              color:text, fontFamily:'DM Mono, monospace', fontSize:11, width:'100%', letterSpacing:0.5 }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ background:'transparent', border:'none',
              color:muted, cursor:'pointer', fontSize:12, lineHeight:1 }}>×</button>
          )}
        </div>
        <div style={{ display:'flex', background:surface2, border:`1px solid ${border}`,
          borderRadius:6, overflow:'hidden', flexShrink:0 }}>
          {['grid','card'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding:'5px 14px', fontFamily:'DM Mono, monospace',
              fontSize:9, letterSpacing:1, cursor:'pointer', border:'none',
              background: view===v ? '#c8f55a' : 'transparent',
              color: view===v ? '#0e0e10' : muted, transition:'all 0.15s',
            }}>{v.toUpperCase()}</button>
          ))}
        </div>
      </div>

      {view === 'grid' ? (
        <GridView habits={filteredHabits} checks={checks}
          toggleCheck={toggleCheck} deleteHabit={handleDelete}
          updateHabit={updateHabit} addHabit={handleAdd}
          theme={theme} groups={groups} />
      ) : (
        <CardView habits={filteredHabits} checks={checks}
          toggleCheck={toggleCheck} addHabit={handleAdd}
          deleteHabit={handleDelete} updateHabit={updateHabit}
          theme={theme} groups={groups} goals={goals}
          setGoal={setGoal} reorderHabits={reorderHabits} />
      )}

      <Toast message={toast.message} show={toast.show}
        onHide={() => setToast({ show:false, message:'' })} />
    </div>
  )
}