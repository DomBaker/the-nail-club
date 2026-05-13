// Run with: node scripts/seed-services.js <admin-email> <admin-password>
import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { readFileSync } from 'fs'

// Parse .env file
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

const services = [
  {
    name: 'BIAB Full Set',
    description: 'A full set of Builder In A Bottle nails. Includes nail prep, shape, BIAB application, colour of choice and top coat. Long-lasting and strengthening.',
    price: 55,
    duration: 90,
    active: true,
  },
  {
    name: 'BIAB Infills',
    description: 'Infill service for existing BIAB nails. Includes nail prep, file and reshape, infill application, and finish. Keeps your nails looking fresh.',
    price: 45,
    duration: 60,
    active: true,
  },
]

const [,, email, password] = process.argv
if (!email || !password) {
  console.error('Usage: node scripts/seed-services.js <admin-email> <admin-password>')
  process.exit(1)
}

async function seed() {
  console.log('Signing in...')
  await signInWithEmailAndPassword(auth, email, password)
  console.log('Signed in. Adding services...\n')

  for (const service of services) {
    const ref = await addDoc(collection(db, 'services'), {
      ...service,
      createdAt: serverTimestamp(),
    })
    console.log(`✓ Added "${service.name}" (${ref.id})`)
  }

  console.log('\nDone! Update prices in the admin panel at /admin/services if needed.')
  process.exit(0)
}

seed().catch(err => {
  console.error('Error:', err.message)
  process.exit(1)
})
