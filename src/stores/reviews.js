import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  collection, getDocs, addDoc, updateDoc,
  doc, query, where, serverTimestamp
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useReviewsStore = defineStore('reviews', () => {
  const reviews = ref([])       // approved reviews (public)
  const allReviews = ref([])    // all reviews (admin)
  const loading = ref(false)

  async function fetchApprovedReviews() {
    loading.value = true
    try {
      const q = query(collection(db, 'reviews'), where('status', '==', 'approved'))
      const snap = await getDocs(q)
      reviews.value = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
    } finally {
      loading.value = false
    }
  }

  async function fetchAllReviews() {
    loading.value = true
    try {
      const snap = await getDocs(collection(db, 'reviews'))
      allReviews.value = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
    } finally {
      loading.value = false
    }
  }

  async function submitReview({ userId, userName, rating, comment }) {
    const docRef = await addDoc(collection(db, 'reviews'), {
      userId,
      userName,
      rating,
      comment,
      status: 'pending',
      createdAt: serverTimestamp()
    })
    return docRef.id
  }

  async function updateReviewStatus(id, status) {
    await updateDoc(doc(db, 'reviews', id), { status })
    const r = allReviews.value.find(r => r.id === id)
    if (r) r.status = status
  }

  return { reviews, allReviews, loading, fetchApprovedReviews, fetchAllReviews, submitReview, updateReviewStatus }
})
