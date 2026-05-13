import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useServicesStore = defineStore('services', () => {
  const services = ref([])
  const loading = ref(false)

  async function fetchServices(activeOnly = false) {
    loading.value = true
    try {
      const snap = await getDocs(collection(db, 'services'))
      let docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      if (activeOnly) docs = docs.filter(s => s.active)
      docs.sort((a, b) => a.name.localeCompare(b.name))
      services.value = docs
    } finally {
      loading.value = false
    }
  }

  async function addService(data) {
    const docRef = await addDoc(collection(db, 'services'), {
      ...data,
      active: true,
      createdAt: serverTimestamp()
    })
    services.value.push({ id: docRef.id, ...data, active: true })
  }

  async function updateService(id, data) {
    await updateDoc(doc(db, 'services', id), data)
    const idx = services.value.findIndex(s => s.id === id)
    if (idx !== -1) services.value[idx] = { ...services.value[idx], ...data }
  }

  async function deleteService(id) {
    await deleteDoc(doc(db, 'services', id))
    services.value = services.value.filter(s => s.id !== id)
  }

  return { services, loading, fetchServices, addService, updateService, deleteService }
})
