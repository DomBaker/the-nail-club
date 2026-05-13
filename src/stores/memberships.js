import { defineStore } from 'pinia'
import { ref } from 'vue'
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useMembershipsStore = defineStore('memberships', () => {
  const users = ref([])
  const loading = ref(false)

  async function fetchAllUsers() {
    loading.value = true
    try {
      const snap = await getDocs(collection(db, 'users'))
      users.value = snap.docs.map(d => ({ uid: d.id, ...d.data() }))
    } finally {
      loading.value = false
    }
  }

  async function setMembershipTier(uid, tier) {
    await updateDoc(doc(db, 'users', uid), {
      membershipTier: tier || null
    })
    const user = users.value.find(u => u.uid === uid)
    if (user) user.membershipTier = tier || null
  }

  return { users, loading, fetchAllUsers, setMembershipTier }
})
