<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <div class="mb-8">
      <RouterLink to="/admin" class="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-rose-600 transition-colors mb-3">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        Back to Dashboard
      </RouterLink>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-stone-900">Services</h1>
          <p class="text-stone-500 text-sm mt-1">Manage the services you offer</p>
        </div>
        <button @click="openAdd" class="btn-primary">+ Add service</button>
      </div>
    </div>

    <div v-if="store.loading" class="flex justify-center py-20"><AppSpinner size="lg" /></div>

    <div v-else-if="store.services.length === 0" class="card p-12 text-center text-stone-400">
      No services yet. Add your first service to get started.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="s in store.services" :key="s.id" class="card p-5 flex flex-col gap-3">
        <div class="flex items-start justify-between gap-2">
          <h3 class="font-semibold text-stone-900">{{ s.name }}</h3>
          <span :class="s.active ? 'badge-confirmed' : 'badge-cancelled'">{{ s.active ? 'Active' : 'Hidden' }}</span>
        </div>
        <p class="text-sm text-stone-500 flex-1">{{ s.description }}</p>
        <div class="flex items-center gap-4 text-sm text-stone-600">
          <span class="font-semibold text-rose-600 text-base">£{{ s.price }}</span>
          <span>{{ s.duration }} min</span>
        </div>
        <div class="flex gap-2 pt-1">
          <button @click="openEdit(s)" class="btn-secondary flex-1 text-sm">Edit</button>
          <button @click="toggleActive(s)" class="btn-ghost flex-1 text-sm">
            {{ s.active ? 'Hide' : 'Show' }}
          </button>
          <button @click="confirmDelete(s)" class="btn-danger text-sm px-3">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit modal -->
    <AppModal v-model="showModal" :title="editing ? 'Edit service' : 'Add service'">
      <form @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label class="label">Service name</label>
          <input v-model="form.name" class="input" placeholder="e.g. Gel Manicure" required />
        </div>
        <div>
          <label class="label">Description</label>
          <textarea v-model="form.description" class="input resize-none" rows="3" placeholder="Describe the service..." />
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">Price (£)</label>
            <input v-model.number="form.price" type="number" min="0" step="0.01" class="input" required />
          </div>
          <div>
            <label class="label">Duration (min)</label>
            <input v-model.number="form.duration" type="number" min="15" step="15" class="input" required />
          </div>
        </div>
        <div v-if="formError" class="text-red-600 text-sm">{{ formError }}</div>
        <div class="flex gap-3 pt-2">
          <button type="submit" class="btn-primary flex-1" :disabled="saving">
            <AppSpinner v-if="saving" size="sm" />
            {{ saving ? 'Saving…' : 'Save' }}
          </button>
          <button type="button" @click="showModal = false" class="btn-secondary flex-1">Cancel</button>
        </div>
      </form>
    </AppModal>

    <!-- Delete confirm -->
    <AppModal v-model="showDeleteModal" title="Delete service">
      <p class="text-stone-600 mb-6">Are you sure you want to delete <strong>{{ toDelete?.name }}</strong>? This cannot be undone.</p>
      <div class="flex gap-3">
        <button @click="doDelete" class="btn-danger flex-1" :disabled="saving">
          <AppSpinner v-if="saving" size="sm" />
          Delete
        </button>
        <button @click="showDeleteModal = false" class="btn-secondary flex-1">Cancel</button>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useServicesStore } from '@/stores/services'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import AppModal from '@/components/ui/AppModal.vue'

const store = useServicesStore()
const showModal = ref(false)
const showDeleteModal = ref(false)
const editing = ref(null)
const toDelete = ref(null)
const saving = ref(false)
const formError = ref('')

const emptyForm = () => ({ name: '', description: '', price: 0, duration: 60 })
const form = ref(emptyForm())

onMounted(() => store.fetchServices())

function openAdd() {
  editing.value = null
  form.value = emptyForm()
  formError.value = ''
  showModal.value = true
}

function openEdit(s) {
  editing.value = s.id
  form.value = { name: s.name, description: s.description, price: s.price, duration: s.duration }
  formError.value = ''
  showModal.value = true
}

async function handleSave() {
  formError.value = ''
  saving.value = true
  try {
    if (editing.value) {
      await store.updateService(editing.value, form.value)
    } else {
      await store.addService(form.value)
    }
    showModal.value = false
  } catch {
    formError.value = 'Failed to save. Please try again.'
  } finally {
    saving.value = false
  }
}

async function toggleActive(s) {
  await store.updateService(s.id, { active: !s.active })
}

function confirmDelete(s) {
  toDelete.value = s
  showDeleteModal.value = true
}

async function doDelete() {
  saving.value = true
  try {
    await store.deleteService(toDelete.value.id)
    showDeleteModal.value = false
  } finally {
    saving.value = false
  }
}
</script>
