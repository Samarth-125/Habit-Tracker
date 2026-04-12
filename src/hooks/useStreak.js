export function useStreak(habitId, checks) {
const today = new Date()

function dateStr(d) {
    return d.toISOString().split('T')[0]
}

function isChecked(d) {
    return !!checks[`${habitId}_${dateStr(d)}`]
}

// current streak — count back from today
function getStreak() {
    let streak = 0
    const d = new Date(today)
    while (isChecked(d)) {
    streak++
    d.setDate(d.getDate() - 1)
    }
    return streak
}

// best streak ever — scan last 365 days
function getBestStreak() {
    let best = 0, current = 0
    for (let i = 364; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (isChecked(d)) {
        current++
        if (current > best) best = current
    } else {
        current = 0
    }
    }
    return best
}

// completion rate last 30 days
function getRate() {
    let done = 0
    for (let i = 0; i < 30; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (isChecked(d)) done++
    }
    return Math.round((done / 30) * 100)
}

return { getStreak, getBestStreak, getRate }
}