<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-display text-3xl font-semibold text-stone-900">My Appointments</h1>
        <p class="text-stone-500 mt-1">Your upcoming and past bookings</p>
      </div>
      <RouterLink to="/booking" class="btn-primary">+ Book now</RouterLink>
    </div>

    <!-- Loyalty cards section -->
    <div class="mb-10">
      <LoyaltyDashboard />
    </div>

    <div v-if="store.loading" class="flex justify-center py-20"><AppSpinner size="lg" /></div>

    <div v-else-if="store.appointments.length === 0" class="card p-12 text-center">
      <p class="text-4xl mb-4">📅</p>
      <p class="font-semibold text-stone-900 mb-1">No appointments yet</p>
      <p class="text-stone-500 text-sm mb-6">Book your first appointment and treat yourself!</p>
      <RouterLink to="/booking" class="btn-primary">Book an appointment</RouterLink>
    </div>

    <div v-else class="space-y-4">
      <!-- Upcoming -->
      <div v-if="upcoming.length > 0">
        <h2 class="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">Upcoming</h2>
        <div v-for="apt in upcoming" :key="apt.id" class="card p-5">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="font-semibold text-stone-900">{{ apt.serviceName }}</h3>
              <p class="text-sm text-stone-500 mt-0.5">{{ formatDate(apt.date) }} at {{ apt.time }}</p>
              <p v-if="apt.notes" class="text-xs text-stone-400 mt-1">Note: {{ apt.notes }}</p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <span :class="`badge-${apt.status}`">{{ apt.status }}</span>
              <button
                v-if="['pending', 'confirmed'].includes(apt.status)"
                @click="openCancelModal(apt)"
                class="text-xs text-red-500 hover:text-red-700 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Past -->
      <div v-if="past.length > 0">
        <h2 class="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3 mt-6">Past</h2>
        <div v-for="apt in past" :key="apt.id" class="card p-5 opacity-70">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h3 class="font-semibold text-stone-700">{{ apt.serviceName }}</h3>
              <p class="text-sm text-stone-400 mt-0.5">{{ formatDate(apt.date) }} at {{ apt.time }}</p>
            </div>
            <div class="flex flex-col items-end gap-2">
              <span :class="`badge-${apt.status}`">{{ apt.status }}</span>
              <span v-if="apt.stampAdded" class="text-xs text-amber-600 font-medium flex items-center gap-1">
                🍒 Stamp added
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel confirm modal -->
    <AppModal v-model="showCancelModal" title="Cancel appointment">
      <p class="text-stone-600 mb-2">Are you sure you want to cancel your <strong>{{ toCancel?.serviceName }}</strong> appointment?</p>
      <p class="text-stone-500 text-sm mb-6">{{ toCancel ? formatDate(toCancel.date) : '' }} at {{ toCancel?.time }}</p>
      <div class="flex gap-3">
        <button @click="doCancel" class="btn-danger flex-1" :disabled="cancelling">
          <AppSpinner v-if="cancelling" size="sm" />
          Yes, cancel it
        </button>
        <button @click="showCancelModal = false" class="btn-secondary flex-1">Keep it</button>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAppointmentsStore } from '@/stores/appointments'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import AppModal from '@/components/ui/AppModal.vue'
import LoyaltyDashboard from '@/components/loyalty/LoyaltyDashboard.vue'

const authStore = useAuthStore()
const store = useAppointmentsStore()
const showCancelModal = ref(false)
const toCancel = ref(null)
const cancelling = ref(false)

onMounted(() => store.fetchMyAppointments(authStore.user.uid))

const todayStr = new Date().toISOString().split('T')[0]

const upcoming = computed(() =>
  store.appointments
    .filter(a => a.date >= todayStr && a.status !== 'cancelled')
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
)

const past = computed(() =>
  store.appointments
    .filter(a => a.date < todayStr || a.status === 'cancelled')
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time))
)

function formatDate(date) {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  })
}

function openCancelModal(apt) {
  toCancel.value = apt
  showCancelModal.value = true
}

async function doCancel() {
  cancelling.value = true
  try {
    await store.cancelAppointment(toCancel.value.id)
    showCancelModal.value = false
  } finally {
    cancelling.value = false
  }
}
</script>
