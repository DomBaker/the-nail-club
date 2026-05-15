<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <img src="/IMG_0046.jpg" alt="The Nail Club" class="h-24 w-24 rounded-2xl object-cover mx-auto shadow-lg border-2 border-rose-200" />
        <h1 class="font-display text-4xl text-[#D4769E] mt-4">Join The Nail Club</h1>
        <p class="text-stone-500 mt-1">Create your account to start booking</p>
      </div>

      <div class="card p-8">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <label class="label">Full name</label>
            <input v-model="form.name" type="text" class="input" placeholder="Jane Smith" required />
          </div>
          <div>
            <label class="label">Email address</label>
            <input v-model="form.email" type="email" class="input" placeholder="you@example.com" required />
          </div>
          <div>
            <label class="label">Mobile number</label>
            <input v-model="form.phone" type="tel" class="input" placeholder="+44 7700 900000" required />
          </div>
          <div>
            <label class="label">Date of birth</label>
            <input v-model="form.dob" type="date" class="input" required :max="maxDob" />
          </div>
          <div>
            <label class="label">Password</label>
            <input v-model="form.password" type="password" class="input" placeholder="At least 6 characters" required minlength="6" />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {{ error }}
          </div>

          <button type="submit" class="btn-primary w-full" :disabled="loading">
            <AppSpinner v-if="loading" size="sm" />
            {{ loading ? 'Creating account…' : 'Create account' }}
          </button>
        </form>

        <div class="flex items-center gap-3 my-5">
          <div class="flex-1 h-px bg-stone-200" />
          <span class="text-stone-400 text-xs">or</span>
          <div class="flex-1 h-px bg-stone-200" />
        </div>

        <button @click="handleGoogle" :disabled="googleLoading" class="w-full flex items-center justify-center gap-3 border border-stone-300 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors mb-6">
          <AppSpinner v-if="googleLoading" size="sm" />
          <svg v-else class="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {{ googleLoading ? 'Signing up…' : 'Continue with Google' }}
        </button>

        <p class="text-center text-sm text-stone-500 mt-6">
          Already have an account?
          <RouterLink to="/login" class="text-rose-600 font-medium hover:underline">Sign in</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const authStore = useAuthStore()
const router = useRouter()

const maxDob = new Date(Date.now() - 13 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const form = ref({ name: '', email: '', phone: '', dob: '', password: '' })
const error = ref('')
const loading = ref(false)
const googleLoading = ref(false)

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await authStore.register(form.value)
    router.push('/booking')
  } catch (e) {
    error.value = friendlyError(e.code)
  } finally {
    loading.value = false
  }
}

async function handleGoogle() {
  googleLoading.value = true
  error.value = ''
  try {
    await authStore.loginWithGoogle()
    router.push('/booking')
  } catch (e) {
    error.value = 'Google sign-in failed. Please try again.'
  } finally {
    googleLoading.value = false
  }
}

function friendlyError(code) {
  const map = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.'
  }
  return map[code] || 'Something went wrong. Please try again.'
}
</script>
