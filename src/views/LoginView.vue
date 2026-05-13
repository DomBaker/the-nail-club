<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <img src="/IMG_0046.jpg" alt="The Nail Club" class="h-24 w-24 rounded-2xl object-cover mx-auto shadow-lg border-2 border-rose-200" />
        <h1 class="font-display text-4xl text-[#D4769E] mt-4">Welcome back</h1>
        <p class="text-stone-500 mt-1">Sign in to your The Nail Club account</p>
      </div>

      <div class="card p-8">
        <!-- Login form -->
        <form v-if="!showReset" @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="login-email" class="label">Email address</label>
            <input id="login-email" v-model="form.email" type="email" class="input" placeholder="you@example.com" required />
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label for="login-password" class="label mb-0">Password</label>
              <button type="button" @click="openReset" class="text-xs text-rose-500 hover:underline">Forgot password?</button>
            </div>
            <input id="login-password" v-model="form.password" type="password" class="input" placeholder="••••••••" required />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {{ error }}
          </div>

          <button type="submit" class="btn-primary w-full" :disabled="loading">
            <AppSpinner v-if="loading" size="sm" />
            {{ loading ? 'Signing in…' : 'Sign in' }}
          </button>
        </form>

        <div v-if="!showReset" class="flex items-center gap-3 my-5">
          <div class="flex-1 h-px bg-stone-200" />
          <span class="text-stone-400 text-xs">or</span>
          <div class="flex-1 h-px bg-stone-200" />
        </div>

        <button v-if="!showReset" @click="handleGoogle" :disabled="googleLoading" class="w-full flex items-center justify-center gap-3 border border-stone-300 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors">
          <AppSpinner v-if="googleLoading" size="sm" />
          <svg v-else class="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {{ googleLoading ? 'Signing in…' : 'Continue with Google' }}
        </button>

        <!-- Reset password form -->
        <div v-else>
          <button @click="showReset = false" class="flex items-center gap-1 text-sm text-stone-500 hover:text-rose-600 mb-5 transition-colors">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            Back to sign in
          </button>

          <h2 class="font-semibold text-stone-900 mb-1">Reset your password</h2>
          <p class="text-stone-500 text-sm mb-5">Enter your email and we'll send you a reset link.</p>

          <div v-if="resetSuccess" class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
            Reset email sent! Check your inbox and follow the link to set a new password.
          </div>

          <form v-else @submit.prevent="handleReset" class="space-y-4">
            <div>
              <label for="reset-email" class="label">Email address</label>
              <input id="reset-email" v-model="resetEmail" type="email" class="input" placeholder="you@example.com" required />
            </div>

            <div v-if="resetError" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {{ resetError }}
            </div>

            <button type="submit" class="btn-primary w-full" :disabled="resetLoading">
              <AppSpinner v-if="resetLoading" size="sm" />
              {{ resetLoading ? 'Sending…' : 'Send reset link' }}
            </button>
          </form>
        </div>

        <p v-if="!showReset" class="text-center text-sm text-stone-500 mt-6">
          Don't have an account?
          <RouterLink to="/register" class="text-rose-600 font-medium hover:underline">Create one</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { sendPasswordResetEmail } from 'firebase/auth'
import { useAuthStore } from '@/stores/auth'
import { auth } from '@/firebase/config'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = ref({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

const googleLoading = ref(false)
const showReset = ref(false)
const resetEmail = ref('')
const resetLoading = ref(false)
const resetError = ref('')
const resetSuccess = ref(false)

async function handleGoogle() {
  googleLoading.value = true
  try {
    await authStore.loginWithGoogle()
    const redirect = route.query.redirect || (authStore.isAdmin ? '/admin' : '/')
    router.push(redirect)
  } catch (e) {
    error.value = 'Google sign-in failed. Please try again.'
  } finally {
    googleLoading.value = false
  }
}

function openReset() {
  resetEmail.value = form.value.email
  resetError.value = ''
  resetSuccess.value = false
  showReset.value = true
}

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(form.value)
    const redirect = route.query.redirect || (authStore.isAdmin ? '/admin' : '/')
    router.push(redirect)
  } catch (e) {
    error.value = friendlyError(e.code)
  } finally {
    loading.value = false
  }
}

async function handleReset() {
  resetError.value = ''
  resetLoading.value = true
  try {
    await sendPasswordResetEmail(auth, resetEmail.value)
    resetSuccess.value = true
  } catch (e) {
    resetError.value = e.code === 'auth/user-not-found'
      ? 'No account found with this email.'
      : 'Failed to send reset email. Please try again.'
  } finally {
    resetLoading.value = false
  }
}

function friendlyError(code) {
  const map = {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please wait and try again.'
  }
  return map[code] || 'Something went wrong. Please try again.'
}
</script>
