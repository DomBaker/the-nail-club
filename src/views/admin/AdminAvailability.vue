<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
    <div class="mb-8">
      <RouterLink to="/admin" class="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-rose-600 transition-colors mb-3">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        Back to Dashboard
      </RouterLink>
      <h1 class="text-2xl font-semibold text-stone-900">Availability</h1>
      <p class="text-stone-500 text-sm mt-1">Set which time slots are open for each day</p>
    </div>

    <!-- Date selector -->
    <div class="card p-6 mb-6">
      <label class="label">Select a date to configure</label>
      <input v-model="selectedDate" type="date" class="input max-w-xs" :min="today" @change="loadSlots" />
    </div>

    <div v-if="selectedDate" class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-semibold text-stone-900">Time slots for {{ formattedDate }}</h2>
        <div class="flex gap-2">
          <button @click="selectAll" class="btn-ghost text-sm">Select all</button>
          <button @click="clearAll" class="btn-ghost text-sm">Clear all</button>
        </div>
      </div>

      <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-6">
        <button
          v-for="slot in allSlots"
          :key="slot"
          @click="toggleSlot(slot)"
          :class="[
            'py-2 px-1 text-xs font-medium rounded-lg border transition-all',
            selectedSlots.has(slot)
              ? 'bg-rose-500 text-white border-rose-500'
              : 'bg-white text-stone-600 border-stone-300 hover:border-rose-400'
          ]"
        >
          {{ slot }}
        </button>
      </div>

      <div class="flex items-center justify-between">
        <p class="text-sm text-stone-500">{{ selectedSlots.size }} slot{{ selectedSlots.size !== 1 ? 's' : '' }} selected</p>
        <button @click="saveSlots" class="btn-primary" :disabled="saving">
          <AppSpinner v-if="saving" size="sm" />
          {{ saving ? 'Saving…' : 'Save availability' }}
        </button>
      </div>

      <div v-if="saved" class="mt-3 text-sm text-green-600 font-medium">Availability saved!</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAvailabilityStore } from '@/stores/availability'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const store = useAvailabilityStore()
const selectedDate = ref('')
const selectedSlots = ref(new Set())
const saving = ref(false)
const saved = ref(false)

const today = new Date().toISOString().split('T')[0]

// Generate slots from 08:00 to 20:00 in 30-min increments
const allSlots = Array.from({ length: 25 }, (_, i) => {
  const totalMins = 8 * 60 + i * 30
  if (totalMins > 20 * 60) return null
  const h = Math.floor(totalMins / 60).toString().padStart(2, '0')
  const m = (totalMins % 60).toString().padStart(2, '0')
  return `${h}:${m}`
}).filter(Boolean)

const formattedDate = computed(() => {
  if (!selectedDate.value) return ''
  return new Date(selectedDate.value + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
})

async function loadSlots() {
  saved.value = false
  const slots = await store.getSlotsForDate(selectedDate.value)
  selectedSlots.value = new Set(slots)
}

function toggleSlot(slot) {
  if (selectedSlots.value.has(slot)) {
    selectedSlots.value.delete(slot)
  } else {
    selectedSlots.value.add(slot)
  }
  selectedSlots.value = new Set(selectedSlots.value)
}

function selectAll() {
  selectedSlots.value = new Set(allSlots)
}

function clearAll() {
  selectedSlots.value = new Set()
}

async function saveSlots() {
  saving.value = true
  saved.value = false
  try {
    await store.setSlotsForDate(selectedDate.value, Array.from(selectedSlots.value).sort())
    saved.value = true
    setTimeout(() => { saved.value = false }, 3000)
  } finally {
    saving.value = false
  }
}
</script>
