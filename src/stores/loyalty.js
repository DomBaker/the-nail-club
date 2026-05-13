import { defineStore } from 'pinia'
import { ref } from 'vue'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/config'

const EMPTY = { totalStamps: 0, tier: 'bronze', cardStamps: 0, discountPercent: 0 }

function computeFromTotal(totalStamps) {
  let tier, discountPercent, cardStamps

  if (totalStamps >= 12) {
    tier = 'gold'
    discountPercent = 10
    cardStamps = (totalStamps - 12) % 6
  } else if (totalStamps >= 6) {
    tier = 'silver'
    discountPercent = 5
    cardStamps = totalStamps - 6
  } else {
    tier = 'bronze'
    discountPercent = 0
    cardStamps = totalStamps
  }

  return { tier, discountPercent, cardStamps }
}

export const useLoyaltyStore = defineStore('loyalty', () => {
  const myLoyalty = ref(null)
  const loading = ref(false)

  async function fetchMyLoyalty(userId) {
    loading.value = true
    try {
      const snap = await getDoc(doc(db, 'loyalty', userId))
      myLoyalty.value = snap.exists() ? snap.data() : { ...EMPTY }
    } finally {
      loading.value = false
    }
  }

  async function addStamp(userId) {
    const docRef = doc(db, 'loyalty', userId)
    const snap = await getDoc(docRef)
    const current = snap.exists() ? snap.data() : { ...EMPTY }
    const newTotal = (current.totalStamps || 0) + 1
    const next = computeFromTotal(newTotal)
    const updated = { totalStamps: newTotal, ...next, updatedAt: serverTimestamp() }
    await setDoc(docRef, updated, { merge: true })
    return updated
  }

  async function removeStamp(userId) {
    const docRef = doc(db, 'loyalty', userId)
    const snap = await getDoc(docRef)
    if (!snap.exists()) return
    const current = snap.data()
    const newTotal = Math.max(0, (current.totalStamps || 0) - 1)
    const next = computeFromTotal(newTotal)
    const updated = { totalStamps: newTotal, ...next, updatedAt: serverTimestamp() }
    await setDoc(docRef, updated, { merge: true })
    return updated
  }

  return { myLoyalty, loading, fetchMyLoyalty, addStamp, removeStamp }
})
