<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <div class="mb-8">
      <h1 class="font-display text-4xl text-[#D4769E]">Dashboard</h1>
      <p class="text-stone-500 mt-1">Welcome back, {{ authStore.userProfile?.name }}</p>
    </div>

    <!-- Stats -->
    <div v-if="!loading" class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="card p-5">
        <p class="text-xs text-stone-500 uppercase tracking-wide font-medium">Today</p>
        <p class="text-3xl font-bold text-stone-900 mt-1">{{ stats.today }}</p>
      </div>
      <div class="card p-5">
        <p class="text-xs text-stone-500 uppercase tracking-wide font-medium">Pending</p>
        <p class="text-3xl font-bold text-amber-500 mt-1">{{ stats.pending }}</p>
      </div>
      <div class="card p-5">
        <p class="text-xs text-stone-500 uppercase tracking-wide font-medium">This week</p>
        <p class="text-3xl font-bold text-rose-500 mt-1">{{ stats.thisWeek }}</p>
      </div>
      <div class="card p-5">
        <p class="text-xs text-stone-500 uppercase tracking-wide font-medium">Total</p>
        <p class="text-3xl font-bold text-stone-900 mt-1">{{ stats.total }}</p>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-20"><AppSpinner size="lg" /></div>

    <div v-else class="grid md:grid-cols-3 gap-6">
      <!-- Upcoming appointments -->
      <div class="md:col-span-2 card p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-semibold text-stone-900">Upcoming Appointments</h2>
          <RouterLink to="/admin/appointments" class="text-sm text-rose-600 hover:underline">View all</RouterLink>
        </div>
        <div v-if="upcoming.length === 0" class="text-stone-400 text-sm py-6 text-center">No upcoming appointments</div>
        <div v-else class="space-y-3">
          <div v-for="apt in upcoming" :key="apt.id" class="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
            <div>
              <p class="font-medium text-stone-900 text-sm">{{ apt.userName }}</p>
              <p class="text-xs text-stone-500">{{ apt.serviceName }} · {{ formatDate(apt.date) }} at {{ apt.time }}</p>
            </div>
            <span :class="`badge-${apt.status}`">{{ apt.status }}</span>
          </div>
        </div>
      </div>

      <!-- Quick links -->
      <div class="space-y-3">
        <h2 class="font-semibold text-stone-900 mb-4">Quick actions</h2>
        <RouterLink to="/admin/services" class="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow group">
          <div class="h-10 w-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 group-hover:bg-rose-200 transition-colors">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          </div>
          <div>
            <p class="font-medium text-stone-900 text-sm">Manage Services</p>
            <p class="text-xs text-stone-500">Add, edit or remove services</p>
          </div>
        </RouterLink>

        <RouterLink to="/admin/availability" class="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow group">
          <div class="h-10 w-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 group-hover:bg-rose-200 transition-colors">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <div>
            <p class="font-medium text-stone-900 text-sm">Set Availability</p>
            <p class="text-xs text-stone-500">Configure open time slots</p>
          </div>
        </RouterLink>

        <RouterLink to="/admin/appointments" class="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow group">
          <div class="h-10 w-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600 group-hover:bg-rose-200 transition-colors">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div>
            <p class="font-medium text-stone-900 text-sm">All Appointments</p>
            <p class="text-xs text-stone-500">View and update bookings</p>
          </div>
        </RouterLink>

        <RouterLink to="/admin/reviews" class="card p-4 flex items-center gap-3 hover:shadow-md transition-shadow group">
          <div class="h-10 w-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 group-hover:bg-amber-200 transition-colors">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          </div>
          <div>
            <p class="font-medium text-stone-900 text-sm">Reviews</p>
            <p class="text-xs text-stone-500">Approve customer reviews</p>
          </div>
        </RouterLink>

        <!-- Test email -->
        <div class="card p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="h-10 w-10 bg-stone-100 rounded-xl flex items-center justify-center text-stone-500">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <p class="font-medium text-stone-900 text-sm">Test Email</p>
              <p class="text-xs text-stone-500">Send a test booking email</p>
            </div>
          </div>
          <div v-if="testEmailStatus" :class="[
            'text-xs rounded-lg px-3 py-2 mb-2',
            testEmailStatus === 'sent' ? 'bg-green-50 text-green-700' : testEmailStatus === 'error' ? 'bg-red-50 text-red-700' : 'bg-stone-50 text-stone-500'
          ]">
            {{ testEmailStatus === 'sent' ? 'Test email sent successfully!' : testEmailStatus === 'error' ? 'Failed to send. Check your EmailJS setup.' : 'Sending…' }}
          </div>
          <div class="flex gap-2">
            <button @click="sendTestEmail('booking')" :disabled="testEmailSending" class="btn-secondary text-xs py-1.5 px-3 flex-1">
              Booking request
            </button>
            <button @click="sendTestEmail('confirm')" :disabled="testEmailSending" class="btn-secondary text-xs py-1.5 px-3 flex-1">
              Confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useAppointmentsStore } from '@/stores/appointments'
import { sendBookingConfirmation, sendAdminConfirmation } from '@/utils/email'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const authStore = useAuthStore()
const store = useAppointmentsStore()
const loading = ref(true)

onMounted(async () => {
  await store.fetchAllAppointments()
  loading.value = false
})

const todayStr = new Date().toISOString().split('T')[0]

const weekEnd = (() => {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString().split('T')[0]
})()

const stats = computed(() => ({
  today: store.appointments.filter(a => a.date === todayStr && a.status !== 'cancelled').length,
  pending: store.appointments.filter(a => a.status === 'pending').length,
  thisWeek: store.appointments.filter(a => a.date >= todayStr && a.date <= weekEnd && a.status !== 'cancelled').length,
  total: store.appointments.filter(a => a.status !== 'cancelled').length
}))

const upcoming = computed(() =>
  store.appointments
    .filter(a => a.date >= todayStr && ['pending', 'confirmed'].includes(a.status))
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 8)
)

function formatDate(date) {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const testEmailSending = ref(false)
const testEmailStatus = ref('')

async function sendTestEmail(type) {
  testEmailSending.value = true
  testEmailStatus.value = 'sending'
  const testApt = {
    userName: authStore.userProfile?.name || 'Admin',
    userEmail: authStore.user?.email,
    serviceName: 'Gel Manicure (test)',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    duration: 60,
    serviceDuration: 60,
    price: 35,
    servicePrice: 35,
    notes: 'This is a test email from The Nail Club admin panel.',
  }
  try {
    if (type === 'booking') await sendBookingConfirmation(testApt)
    else await sendAdminConfirmation(testApt)
    testEmailStatus.value = 'sent'
    setTimeout(() => { testEmailStatus.value = '' }, 5000)
  } catch {
    testEmailStatus.value = 'error'
    setTimeout(() => { testEmailStatus.value = '' }, 5000)
  } finally {
    testEmailSending.value = false
  }
}
</script>
