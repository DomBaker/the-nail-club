<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <div class="mb-8">
      <RouterLink to="/admin" class="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-rose-600 transition-colors mb-3">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        Back to Dashboard
      </RouterLink>
      <h1 class="text-2xl font-semibold text-stone-900">All Appointments</h1>
      <p class="text-stone-500 text-sm mt-1">View and manage every booking</p>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3 mb-6">
      <input v-model="filterDate" type="date" class="input max-w-[180px]" placeholder="Filter by date" />
      <select v-model="filterStatus" class="input max-w-[160px]">
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <button @click="clearFilters" class="btn-ghost text-sm">Clear</button>
    </div>

    <!-- Feedback banners -->
    <div v-if="emailError" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4 flex justify-between items-center">
      <span>{{ emailError }}</span>
      <button @click="emailError = ''" class="ml-4 text-red-400 hover:text-red-600">&times;</button>
    </div>
    <div v-if="emailSent" class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
      Confirmation email sent to customer.
    </div>
    <div v-if="stampFeedback" class="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3 mb-4 flex items-center gap-2">
      🍒 {{ stampFeedback }}
    </div>

    <div v-if="store.loading" class="flex justify-center py-20"><AppSpinner size="lg" /></div>

    <div v-else-if="filtered.length === 0" class="card p-12 text-center text-stone-400">
      No appointments found.
    </div>

    <!-- Mobile cards -->
    <div class="sm:hidden space-y-3">
      <div v-for="apt in filtered" :key="apt.id" class="card p-4">
        <div class="flex items-start justify-between gap-2 mb-2">
          <div>
            <p class="font-medium text-stone-900 text-sm">{{ apt.userName }}</p>
            <p class="text-stone-400 text-xs">{{ apt.userEmail }}</p>
          </div>
          <div class="flex flex-col items-end gap-1">
            <span :class="`badge-${apt.status}`">{{ apt.status }}</span>
            <span v-if="apt.stampAdded" class="text-xs text-amber-600 font-medium">🍒 Stamped</span>
          </div>
        </div>
        <p class="text-stone-700 text-sm mb-1">{{ apt.serviceName }}</p>
        <p class="text-stone-500 text-xs mb-3">{{ formatDate(apt.date) }} at {{ apt.time }}</p>
        <div class="flex gap-2 flex-wrap">
          <button v-if="apt.status === 'pending'" @click="updateStatus(apt.id, 'confirmed')" class="btn-secondary text-xs py-1 px-3">Confirm</button>
          <button
            v-if="apt.status === 'confirmed' && !apt.stampAdded"
            @click="openAttendedModal(apt)"
            class="btn-secondary text-xs py-1 px-3 flex items-center gap-1"
          >
            🍒 Mark Attended
          </button>
          <button
            v-if="apt.stampAdded"
            @click="openRemoveStampModal(apt)"
            class="btn-ghost text-xs py-1 px-3 text-red-500 hover:bg-red-50"
          >
            Remove stamp
          </button>
          <button v-if="['pending','confirmed'].includes(apt.status)" @click="updateStatus(apt.id, 'cancelled')" class="btn-ghost text-xs py-1 px-3 text-red-600 hover:bg-red-50">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Desktop table -->
    <div class="hidden sm:block card overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-stone-50 border-b border-stone-200">
          <tr>
            <th class="text-left px-4 py-3 text-stone-600 font-medium">Customer</th>
            <th class="text-left px-4 py-3 text-stone-600 font-medium">Service</th>
            <th class="text-left px-4 py-3 text-stone-600 font-medium">Date & Time</th>
            <th class="text-left px-4 py-3 text-stone-600 font-medium">Status</th>
            <th class="text-left px-4 py-3 text-stone-600 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100">
          <tr v-for="apt in filtered" :key="apt.id" class="hover:bg-stone-50">
            <td class="px-4 py-3">
              <div class="font-medium text-stone-900">{{ apt.userName }}</div>
              <div class="text-stone-400 text-xs">{{ apt.userEmail }}</div>
            </td>
            <td class="px-4 py-3 text-stone-700">{{ apt.serviceName }}</td>
            <td class="px-4 py-3 text-stone-700">
              <div>{{ formatDate(apt.date) }}</div>
              <div class="text-stone-400 text-xs">{{ apt.time }}</div>
            </td>
            <td class="px-4 py-3">
              <div class="flex flex-col gap-1">
                <span :class="`badge-${apt.status}`">{{ apt.status }}</span>
                <span v-if="apt.stampAdded" class="text-xs text-amber-600 font-medium">🍒 Stamped</span>
              </div>
            </td>
            <td class="px-4 py-3">
              <div class="flex gap-1 flex-wrap">
                <button v-if="apt.status === 'pending'" @click="updateStatus(apt.id, 'confirmed')" class="btn-secondary text-xs py-1 px-2">Confirm</button>
                <button
                  v-if="apt.status === 'confirmed' && !apt.stampAdded"
                  @click="openAttendedModal(apt)"
                  class="btn-secondary text-xs py-1 px-2 flex items-center gap-1"
                >
                  🍒 Mark Attended
                </button>
                <button
                  v-if="apt.stampAdded"
                  @click="openRemoveStampModal(apt)"
                  class="btn-ghost text-xs py-1 px-2 text-red-500 hover:bg-red-50"
                >
                  Remove stamp
                </button>
                <button v-if="['pending','confirmed'].includes(apt.status)" @click="updateStatus(apt.id, 'cancelled')" class="btn-ghost text-xs py-1 px-2 text-red-600 hover:bg-red-50">Cancel</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mark Attended confirmation modal -->
    <AppModal v-model="showAttendedModal" title="Mark appointment attended">
      <div v-if="toAttend">
        <p class="text-stone-600 mb-1">Confirm that <strong>{{ toAttend.userName }}</strong> attended their appointment.</p>
        <p class="text-stone-500 text-sm mb-1">{{ toAttend.serviceName }} — {{ formatDate(toAttend.date) }} at {{ toAttend.time }}</p>
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2 my-4">
          <span class="text-lg">🍒</span>
          <p class="text-sm text-amber-800">This will add a loyalty stamp to <strong>{{ toAttend.userName }}</strong>'s card.</p>
        </div>
        <div class="flex gap-3 mt-4">
          <button @click="confirmAttended" class="btn-primary flex-1" :disabled="markingAttended">
            <AppSpinner v-if="markingAttended" size="sm" />
            Yes, attended — add stamp
          </button>
          <button @click="showAttendedModal = false" class="btn-secondary flex-1">Cancel</button>
        </div>
      </div>
    </AppModal>

    <!-- Remove stamp confirmation modal -->
    <AppModal v-model="showRemoveStampModal" title="Remove loyalty stamp">
      <div v-if="toRemoveStamp">
        <p class="text-stone-600 mb-1">Remove the loyalty stamp from <strong>{{ toRemoveStamp.userName }}</strong>?</p>
        <p class="text-stone-500 text-sm mb-1">{{ toRemoveStamp.serviceName }} — {{ formatDate(toRemoveStamp.date) }} at {{ toRemoveStamp.time }}</p>
        <div class="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 my-4">
          <span class="text-lg">⚠️</span>
          <p class="text-sm text-red-700">This will deduct one stamp from their loyalty card and may lower their tier.</p>
        </div>
        <div class="flex gap-3 mt-4">
          <button @click="confirmRemoveStamp" class="btn-danger flex-1" :disabled="removingStamp">
            <AppSpinner v-if="removingStamp" size="sm" />
            Yes, remove stamp
          </button>
          <button @click="showRemoveStampModal = false" class="btn-secondary flex-1">Cancel</button>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppointmentsStore } from '@/stores/appointments'
import { useLoyaltyStore } from '@/stores/loyalty'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import AppModal from '@/components/ui/AppModal.vue'
import { sendAdminConfirmation } from '@/utils/email'

const store = useAppointmentsStore()
const loyaltyStore = useLoyaltyStore()

const filterDate = ref('')
const filterStatus = ref('')
const emailError = ref('')
const emailSent = ref(false)
const stampFeedback = ref('')

const showAttendedModal = ref(false)
const toAttend = ref(null)
const markingAttended = ref(false)

const showRemoveStampModal = ref(false)
const toRemoveStamp = ref(null)
const removingStamp = ref(false)

onMounted(() => store.fetchAllAppointments())

const filtered = computed(() => {
  return store.appointments.filter(a => {
    if (filterDate.value && a.date !== filterDate.value) return false
    if (filterStatus.value && a.status !== filterStatus.value) return false
    return true
  })
})

function clearFilters() {
  filterDate.value = ''
  filterStatus.value = ''
}

async function updateStatus(id, status) {
  emailError.value = ''
  emailSent.value = false
  await store.updateStatus(id, status)
  if (status === 'confirmed') {
    const apt = store.appointments.find(a => a.id === id)
    if (apt) {
      try {
        await sendAdminConfirmation(apt)
        emailSent.value = true
        setTimeout(() => { emailSent.value = false }, 4000)
      } catch {
        emailError.value = 'Status updated but confirmation email failed to send. Check your EmailJS setup.'
      }
    }
  }
}

function openAttendedModal(apt) {
  toAttend.value = apt
  showAttendedModal.value = true
}

async function confirmAttended() {
  if (!toAttend.value) return
  markingAttended.value = true
  try {
    // Mark appointment completed + stampAdded flag
    await store.markAttended(toAttend.value.id)
    // Add loyalty stamp for the customer
    const result = await loyaltyStore.addStamp(toAttend.value.userId)

    // Build feedback message
    const tierNames = { bronze: 'Bronze', silver: 'Silver', gold: 'Gold' }
    let msg = `Stamp added for ${toAttend.value.userName}! They now have ${result.totalStamps} stamp${result.totalStamps === 1 ? '' : 's'}.`
    const prevTier = toAttend.value._prevTier || loyaltyStore.myLoyalty?.tier || 'bronze'
    if (result.tier !== prevTier && result.tier !== 'bronze') {
      msg += ` 🎉 They've reached ${tierNames[result.tier]} tier!`
    }
    stampFeedback.value = msg
    setTimeout(() => { stampFeedback.value = '' }, 6000)

    showAttendedModal.value = false
  } catch (err) {
    console.error('Failed to mark attended:', err)
  } finally {
    markingAttended.value = false
  }
}

function openRemoveStampModal(apt) {
  toRemoveStamp.value = apt
  showRemoveStampModal.value = true
}

async function confirmRemoveStamp() {
  if (!toRemoveStamp.value) return
  removingStamp.value = true
  try {
    await loyaltyStore.removeStamp(toRemoveStamp.value.userId)
    await store.undoStamp(toRemoveStamp.value.id)
    stampFeedback.value = `Stamp removed from ${toRemoveStamp.value.userName}'s loyalty card.`
    setTimeout(() => { stampFeedback.value = '' }, 5000)
    showRemoveStampModal.value = false
  } catch (err) {
    console.error('Failed to remove stamp:', err)
  } finally {
    removingStamp.value = false
  }
}

function formatDate(date) {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  })
}
</script>
