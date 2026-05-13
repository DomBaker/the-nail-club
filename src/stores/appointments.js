import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection, getDocs, addDoc, updateDoc,
  doc, query, where, serverTimestamp
} from 'firebase/firestore'
import { db } from '@/firebase/config'

// Sort appointments newest first by date+time
function sortDesc(arr) {
  return arr.sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
}

export const useAppointmentsStore = defineStore('appointments', () => {
  const appointments = ref([])
  const loading = ref(false)

  async function fetchMyAppointments(userId) {
    loading.value = true
    try {
      const snap = await getDocs(
        query(collection(db, 'appointments'), where('userId', '==', userId))
      )
      appointments.value = sortDesc(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } finally {
      loading.value = false
    }
  }

  async function fetchAllAppointments() {
    loading.value = true
    try {
      const snap = await getDocs(collection(db, 'appointments'))
      appointments.value = sortDesc(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } finally {
      loading.value = false
    }
  }

  async function bookAppointment(data) {
    const docRef = await addDoc(collection(db, 'appointments'), {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp()
    })
    appointments.value.unshift({ id: docRef.id, ...data, status: 'pending' })
    return docRef.id
  }

  async function updateStatus(id, status) {
    await updateDoc(doc(db, 'appointments', id), { status })
    const idx = appointments.value.findIndex(a => a.id === id)
    if (idx !== -1) appointments.value[idx].status = status
  }

  async function markAttended(id) {
    await updateDoc(doc(db, 'appointments', id), { status: 'completed', stampAdded: true })
    const idx = appointments.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      appointments.value[idx].status = 'completed'
      appointments.value[idx].stampAdded = true
    }
  }

  async function undoStamp(id) {
    await updateDoc(doc(db, 'appointments', id), { stampAdded: false })
    const idx = appointments.value.findIndex(a => a.id === id)
    if (idx !== -1) appointments.value[idx].stampAdded = false
  }

  async function cancelAppointment(id) {
    await updateStatus(id, 'cancelled')
  }

  // Returns booked time slots for a given date — single where, status filtered in JS
  async function getBookedSlots(date) {
    const snap = await getDocs(
      query(collection(db, 'appointments'), where('date', '==', date))
    )
    return snap.docs
      .map(d => d.data())
      .filter(d => ['pending', 'confirmed'].includes(d.status))
      .map(d => d.time)
  }

  return {
    appointments, loading,
    fetchMyAppointments, fetchAllAppointments,
    bookAppointment, updateStatus, markAttended, undoStamp, cancelAppointment, getBookedSlots
  }
})
