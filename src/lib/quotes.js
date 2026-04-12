export const QUOTES = [
  // Famous
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Do one thing every day that scares you.", author: "Eleanor Roosevelt" },
  { text: "Well-behaved women seldom make history.", author: "Laurel Thatcher Ulrich" },
  { text: "A room without books is like a body without a soul.", author: "Marcus Tullius Cicero" },
  { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't count the days. Make the days count.", author: "Muhammad Ali" },
  { text: "You are enough. You have enough. You do enough.", author: "Anonymous" },
  // Meme
  { text: "I'm not lazy, I'm on energy saving mode.", author: "Anonymous" },
  { text: "My bed is a magical place where I suddenly remember everything I forgot to do.", author: "Anonymous" },
  { text: "I will start tomorrow. — Me, every day.", author: "Anonymous" },
  { text: "Exercise? I thought you said extra fries.", author: "Anonymous" },
  { text: "I finally got 8 hours of sleep. It took me 3 days but whatever.", author: "Anonymous" },
  { text: "Be a bumblebee. Aerodynamically it shouldn't fly, but it does anyway.", author: "Anonymous" },
  { text: "Step 1: Make a to-do list. Step 2: Feel productive. Step 3: Do nothing.", author: "Anonymous" },
  { text: "My wallet is like an onion. Opening it makes me cry.", author: "Anonymous" },
  // Human
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Progress, not perfection.", author: "Anonymous" },
  { text: "You're doing better than you think.", author: "Anonymous" },
  { text: "Rest if you must, but don't you quit.", author: "Edgar Guest" },
  { text: "One day or day one. You decide.", author: "Anonymous" },
  { text: "Your only competition is who you were yesterday.", author: "Anonymous" },
  { text: "Discipline is choosing between what you want now and what you want most.", author: "Anonymous" },
]

export function getAllQuotes() {
  try {
    const custom = JSON.parse(localStorage.getItem('ht_custom_quotes') || '[]')
    return [...QUOTES, ...custom]
  } catch { return QUOTES }
}

export function getCustomQuotes() {
  try {
    return JSON.parse(localStorage.getItem('ht_custom_quotes') || '[]')
  } catch { return [] }
}

export function addCustomQuote(text, author) {
  const custom = getCustomQuotes()
  custom.push({ text, author: author || 'Anonymous', custom: true })
  localStorage.setItem('ht_custom_quotes', JSON.stringify(custom))
}

export function deleteCustomQuote(index) {
  const custom = getCustomQuotes()
  custom.splice(index, 1)
  localStorage.setItem('ht_custom_quotes', JSON.stringify(custom))
}

export function getDailyQuote() {
  const all = getAllQuotes()
  const day = Math.floor(Date.now() / 86400000)
  return all[day % all.length]
}