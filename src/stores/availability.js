import { defineStore } from 'pinia'
import { ref } from 'vue'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useAvailabilityStore = defineStore('availability', () => {
  const cache = ref({})

  async function getSlotsForDate(date) {
    if (cache.value[date]) return cache.value[date]
    const snap = await getDoc(doc(db, 'availability', date))
    const slots = snap.exists() ? snap.data().slots : []
    cache.value[date] = slots
    return slots
  }

  async function setSlotsForDate(date, slots) {
    await setDoc(doc(db, 'availability', date), { slots })
    cache.value[date] = slots
  }

  function clearCache() {
    cache.value = {}
  }

  return { cache, getSlotsForDate, setSlotsForDate, clearCache }
})
