import { useState, useEffect } from 'react'

const DEFAULT_HABITS = [
  { id: 1, name: 'Morning workout', unit: 'min',     group: 'Health' },
  { id: 2, name: 'Read 30 mins',    unit: 'pages',   group: 'Learning' },
  { id: 3, name: 'Drink water',     unit: 'glasses', group: 'Health' },
  { id: 4, name: 'Meditate',        unit: 'min',     group: 'Mindfulness' },
  { id: 5, name: 'Sleep by 11pm',   unit: 'hrs',     group: 'Health' },
]

const GROUP_COLORS = [
  '#5af5c8','#c8f55a','#f5c85a','#f55a8c',
  '#a78bfa','#38bdf8','#fb923c','#34d399',
]

export function getGroupColor(groupName, groups) {
  const idx = groups.indexOf(groupName)
  return GROUP_COLORS[idx % GROUP_COLORS.length] || '#9191a8'
}

function load() {
  try {
    const d = JSON.parse(localStorage.getItem('ht_habits') || '{}')
    return {
      habits: d.habits || DEFAULT_HABITS,
      checks: d.checks || {},
      values: d.values || {},
      groups: d.groups || ['Health','Learning','Mindfulness','Work','Personal'],
      goals:  d.goals  || {},
    }
  } catch {
    return {
      habits: DEFAULT_HABITS, checks: {}, values: {},
      groups: ['Health','Learning','Mindfulness','Work','Personal'],
      goals: {},
    }
  }
}

function save(habits, checks, values, groups, goals) {
  localStorage.setItem('ht_habits', JSON.stringify({ habits, checks, values, groups, goals }))
}

export function useHabits() {
  const init = load()
  const [habits,  setHabits]  = useState(init.habits)
  const [checks,  setChecks]  = useState(init.checks)
  const [values,  setValues]  = useState(init.values)
  const [groups,  setGroups]  = useState(init.groups)
  const [goals,   setGoals]   = useState(init.goals)

  useEffect(() => { save(habits, checks, values, groups, goals) }, [habits, checks, values, groups, goals])

  const key = (habitId, dateStr) => `${habitId}_${dateStr}`

  function toggleCheck(habitId, dateStr) {
    setChecks(prev => ({ ...prev, [key(habitId, dateStr)]: !prev[key(habitId, dateStr)] }))
  }

  function setValue(habitId, dateStr, val) {
    setValues(prev => ({ ...prev, [key(habitId, dateStr)]: val }))
  }

  function addHabit(name, unit = '', group = 'Personal') {
    const newHabit = { id: Date.now(), name, unit, group }
    setHabits(prev => [...prev, newHabit])
  }

  function deleteHabit(habitId) {
    setHabits(prev => prev.filter(h => h.id !== habitId))
  }

  function updateHabit(habitId, name, unit, group) {
    setHabits(prev => prev.map(h =>
      h.id === habitId ? { ...h, name, unit, group: group || h.group } : h
    ))
  }

  function reorderHabits(fromIndex, toIndex) {
    setHabits(prev => {
      const updated = [...prev]
      const [moved] = updated.splice(fromIndex, 1)
      updated.splice(toIndex, 0, moved)
      return updated
    })
  }

  function addGroup(name) {
    if (!groups.includes(name)) setGroups(prev => [...prev, name])
  }

  function setGoal(habitId, target) {
    setGoals(prev => ({ ...prev, [habitId]: target }))
  }

  return {
    habits, checks, values, groups, goals,
    toggleCheck, setValue,
    addHabit, deleteHabit, updateHabit,
    addGroup, setGoal, reorderHabits,
  }
}