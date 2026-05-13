// Run with: node scripts/seed-availability.js <admin-email> <admin-password>
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { readFileSync } from 'fs'

// Parse .env
const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .trim().split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => l.split('=').map(s => s.trim()))
)

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
})

const auth = getAuth(app)
const db = getFirestore(app)

// 09:00 – 16:30 in 30-min increments
const SLOTS = []
for (let h = 9; h <= 16; h++) {
  SLOTS.push(`${String(h).padStart(2, '0')}:00`)
  if (h < 16) SLOTS.push(`${String(h).padStart(2, '0')}:30`)
}
SLOTS.push('16:30')

// Generate all Mon–Fri dates from tomorrow for the next 3 months
function getWeekdays(weeks = 13) {
  const dates = []
  const start = new Date()
  start.setDate(start.getDate() + 1) // start from tomorrow
  start.setHours(0, 0, 0, 0)

  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const day = d.getDay() // 0=Sun, 6=Sat
    if (day >= 1 && day <= 5) {
      dates.push(d.toISOString().split('T')[0])
    }
  }
  return dates
}

const [,, email, password] = process.argv
if (!email || !password) {
  console.error('Usage: node scripts/seed-availability.js <admin-email> <admin-password>')
  process.exit(1)
}

async function seed() {
  console.log('Signing in...')
  await signInWithEmailAndPassword(auth, email, password)

  const dates = getWeekdays(13) // ~3 months
  console.log(`Setting availability for ${dates.length} weekdays (Mon–Fri, 09:00–16:30)\n`)

  for (const date of dates) {
    await setDoc(doc(db, 'availability', date), { slots: SLOTS })
    process.stdout.write(`✓ ${date}\r`)
  }

  console.log(`\n\nDone! ${dates.length} days configured.`)
  process.exit(0)
}

seed().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
