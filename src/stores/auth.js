import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, isConfigured } from '@/firebase/config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const userProfile = ref(null)
  const loading = ref(true)

  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => userProfile.value?.role === 'admin')

  async function fetchUserProfile(uid) {
    const snap = await getDoc(doc(db, 'users', uid))
    if (snap.exists()) {
      userProfile.value = snap.data()
    }
  }

  function init() {
    if (!isConfigured) {
      loading.value = false
      return Promise.resolve()
    }
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        user.value = firebaseUser
        if (firebaseUser) {
          await fetchUserProfile(firebaseUser.uid)
        } else {
          userProfile.value = null
        }
        loading.value = false
        resolve()
      })
    })
  }

  async function register({ name, email, password, phone, dob }) {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(credential.user, { displayName: name })
    await setDoc(doc(db, 'users', credential.user.uid), {
      name,
      email,
      phone: phone || '',
      dob: dob || '',
      role: 'customer',
      createdAt: serverTimestamp()
    })
    userProfile.value = { name, email, phone: phone || '', dob: dob || '', role: 'customer' }
  }

  async function updateUserProfile({ name, phone, dob }) {
    if (!user.value) return
    const updates = { name, phone, dob }
    await updateDoc(doc(db, 'users', user.value.uid), updates)
    await updateProfile(user.value, { displayName: name })
    userProfile.value = { ...userProfile.value, ...updates }
  }

  async function deleteAccount() {
    if (!user.value) return
    await deleteDoc(doc(db, 'users', user.value.uid))
    await deleteUser(user.value)
    user.value = null
    userProfile.value = null
  }

  async function login({ email, password }) {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    await fetchUserProfile(credential.user.uid)
  }

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider()
    const credential = await signInWithPopup(auth, provider)
    const uid = credential.user.uid
    const snap = await getDoc(doc(db, 'users', uid))
    if (!snap.exists()) {
      const name = credential.user.displayName || ''
      const email = credential.user.email
      await setDoc(doc(db, 'users', uid), {
        name, email, phone: '', role: 'customer', createdAt: serverTimestamp()
      })
      userProfile.value = { name, email, phone: '', role: 'customer' }
    } else {
      userProfile.value = snap.data()
    }
  }

  async function logout() {
    await signOut(auth)
    user.value = null
    userProfile.value = null
  }

  return { user, userProfile, loading, isLoggedIn, isAdmin, init, register, login, loginWithGoogle, logout, updateUserProfile, deleteAccount }
})
