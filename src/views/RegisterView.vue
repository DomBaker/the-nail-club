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
            <label class="label">Phone number <span class="text-stone-400 font-normal">(optional)</span></label>
            <input v-model="form.phone" type="tel" class="input" placeholder="+1 (555) 000-0000" />
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

const form = ref({ name: '', email: '', phone: '', password: '' })
const error = ref('')
const loading = ref(false)

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

function friendlyError(code) {
  const map = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/invalid-email': 'Please enter a valid email address.'
  }
  return map[code] || 'Something went wrong. Please try again.'
}
</script>
