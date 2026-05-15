<template>
  <div class="min-h-[calc(100vh-4rem)] px-4 py-12">
    <div class="max-w-lg mx-auto">
      <h1 class="font-display text-4xl text-[#D4769E] mb-2">My Account</h1>
      <p class="text-stone-500 mb-8">Update your details or manage your account.</p>

      <!-- Update form -->
      <div class="card p-8 mb-6">
        <h2 class="font-semibold text-stone-800 mb-5">Personal details</h2>
        <form @submit.prevent="handleUpdate" class="space-y-5">
          <div>
            <label class="label">Full name</label>
            <input v-model="form.name" type="text" class="input" required />
          </div>
          <div>
            <label class="label">Mobile number</label>
            <input v-model="form.phone" type="tel" class="input" required />
          </div>
          <div>
            <label class="label">Date of birth</label>
            <input v-model="form.dob" type="date" class="input" :max="maxDob" />
          </div>
          <div>
            <label class="label">Email address</label>
            <input :value="authStore.userProfile?.email" type="email" class="input bg-stone-50 text-stone-400 cursor-not-allowed" disabled />
            <p class="text-xs text-stone-400 mt-1">Email cannot be changed here.</p>
          </div>

          <div v-if="updateSuccess" class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
            Details updated successfully.
          </div>
          <div v-if="updateError" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {{ updateError }}
          </div>

          <button type="submit" class="btn-primary w-full" :disabled="updateLoading">
            <AppSpinner v-if="updateLoading" size="sm" />
            {{ updateLoading ? 'Saving…' : 'Save changes' }}
          </button>
        </form>
      </div>

      <!-- Danger zone -->
      <div class="card p-8 border border-red-200">
        <h2 class="font-semibold text-red-700 mb-2">Danger zone</h2>
        <p class="text-sm text-stone-500 mb-5">Deleting your account is permanent and cannot be undone. All your data will be removed.</p>

        <div v-if="!confirmDelete">
          <button @click="confirmDelete = true" class="w-full border border-red-300 text-red-600 font-medium rounded-xl px-4 py-2.5 text-sm hover:bg-red-50 transition-colors">
            Delete my account
          </button>
        </div>
        <div v-else class="space-y-3">
          <p class="text-sm font-medium text-red-700">Are you sure? This cannot be undone.</p>
          <div v-if="deleteError" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {{ deleteError }}
          </div>
          <div class="flex gap-3">
            <button @click="confirmDelete = false" class="flex-1 border border-stone-300 text-stone-700 font-medium rounded-xl px-4 py-2.5 text-sm hover:bg-stone-50 transition-colors">
              Cancel
            </button>
            <button @click="handleDelete" :disabled="deleteLoading" class="flex-1 bg-red-600 text-white font-medium rounded-xl px-4 py-2.5 text-sm hover:bg-red-700 transition-colors disabled:opacity-50">
              <AppSpinner v-if="deleteLoading" size="sm" />
              {{ deleteLoading ? 'Deleting…' : 'Yes, delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const authStore = useAuthStore()
const router = useRouter()

const maxDob = new Date(Date.now() - 13 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

const form = ref({ name: '', phone: '', dob: '' })
const updateLoading = ref(false)
const updateError = ref('')
const updateSuccess = ref(false)

const confirmDelete = ref(false)
const deleteLoading = ref(false)
const deleteError = ref('')

onMounted(() => {
  const p = authStore.userProfile
  if (p) {
    form.value.name = p.name || ''
    form.value.phone = p.phone || ''
    form.value.dob = p.dob || ''
  }
})

async function handleUpdate() {
  updateLoading.value = true
  updateError.value = ''
  updateSuccess.value = false
  try {
    await authStore.updateUserProfile(form.value)
    updateSuccess.value = true
  } catch (e) {
    updateError.value = 'Failed to update details. Please try again.'
  } finally {
    updateLoading.value = false
  }
}

async function handleDelete() {
  deleteLoading.value = true
  deleteError.value = ''
  try {
    await authStore.deleteAccount()
    router.push('/')
  } catch (e) {
    if (e.code === 'auth/requires-recent-login') {
      deleteError.value = 'For security, please sign out and sign back in before deleting your account.'
    } else {
      deleteError.value = 'Failed to delete account. Please try again.'
    }
  } finally {
    deleteLoading.value = false
  }
}
</script>
