<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-10">
    <div class="mb-8">
      <h1 class="font-display text-3xl font-semibold text-stone-900">Book an Appointment</h1>
      <p class="text-stone-500 mt-1">Choose your service, date and time</p>
    </div>

    <!-- Step indicator -->
    <div class="flex items-center gap-2 mb-8 flex-wrap">
      <div v-for="(label, i) in steps" :key="i" class="flex items-center gap-2">
        <div :class="[
          'h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
          step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-rose-500 text-white' : 'bg-stone-200 text-stone-500'
        ]">
          <svg v-if="step > i + 1" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span v-else>{{ i + 1 }}</span>
        </div>
        <span :class="['text-sm', step === i + 1 ? 'text-stone-900 font-medium' : 'text-stone-400']">{{ label }}</span>
        <div v-if="i < steps.length - 1" class="h-px w-8 bg-stone-200 mx-1 hidden sm:block" />
      </div>
    </div>

    <!-- Step 1: Choose service -->
    <div v-if="step === 1">
      <div v-if="discountLabel" class="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center gap-2 text-sm text-rose-700">
        <span>{{ discountLabel }}</span>
      </div>

      <div v-if="servicesStore.loading" class="flex justify-center py-20"><AppSpinner size="lg" /></div>
      <div v-else-if="servicesStore.services.length === 0" class="card p-12 text-center text-stone-400">
        No services available at the moment. Please check back soon.
      </div>
      <div v-else class="grid sm:grid-cols-2 gap-4">
        <button
          v-for="s in servicesStore.services"
          :key="s.id"
          @click="selectService(s)"
          :class="[
            'card p-5 text-left transition-all hover:shadow-md',
            selected.service?.id === s.id ? 'ring-2 ring-rose-500 shadow-md' : ''
          ]"
        >
          <h3 class="font-semibold text-stone-900">{{ s.name }}</h3>
          <p class="text-sm text-stone-500 mt-1">{{ s.description }}</p>
          <div class="flex items-center gap-3 mt-3">
            <template v-if="loyaltyDiscountPct > 0">
              <span class="text-stone-400 line-through text-sm">£{{ s.price }}</span>
              <span class="text-rose-600 font-semibold">£{{ discountedPrice(s.price) }}</span>
            </template>
            <span v-else class="text-rose-600 font-semibold">£{{ s.price }}</span>
            <span class="text-stone-400 text-sm">{{ s.duration }} min</span>
          </div>
        </button>
      </div>
      <div class="flex justify-end mt-6">
        <button @click="step = 2" :disabled="!selected.service" class="btn-primary">
          Continue <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>

    <!-- Step 2: Choose date and time -->
    <div v-if="step === 2">
      <div class="card p-6 mb-4">
        <label for="booking-date" class="label">Choose a date</label>
        <input id="booking-date" v-model="selected.date" type="date" class="input max-w-xs" :min="tomorrow" @change="loadTimeSlots" />
      </div>

      <div v-if="selected.date" class="card p-6">
        <h3 class="font-semibold text-stone-900 mb-4">Available times</h3>
        <div v-if="timeSlotsLoading" class="flex justify-center py-8"><AppSpinner /></div>
        <div v-else-if="slotError" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {{ slotError }}
        </div>
        <div v-else-if="availableSlots.length === 0" class="text-stone-400 text-sm py-4 text-center">
          No available time slots for this date. Please choose another date.
        </div>
        <div v-else class="grid grid-cols-4 sm:grid-cols-6 gap-2">
          <button
            v-for="slot in availableSlots"
            :key="slot"
            @click="selected.time = slot"
            :class="[
              'py-2 text-sm font-medium rounded-lg border transition-all',
              selected.time === slot
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-white text-stone-700 border-stone-300 hover:border-rose-400'
            ]"
          >
            {{ slot }}
          </button>
        </div>
      </div>

      <div class="flex justify-between mt-6">
        <button @click="step = 1" class="btn-secondary">Back</button>
        <button @click="step = 3" :disabled="!selected.date || !selected.time" class="btn-primary">
          Continue <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>

    <!-- Step 3: Confirm -->
    <div v-if="step === 3">
      <div class="card p-6 mb-6">
        <h3 class="font-semibold text-stone-900 mb-4">Confirm your booking</h3>
        <dl class="space-y-3 text-sm">
          <div class="flex justify-between items-start gap-4">
            <dt class="text-stone-500 shrink-0">Service</dt>
            <dd class="font-medium text-stone-900 text-right">{{ selected.service.name }}</dd>
          </div>
          <div class="flex justify-between items-start gap-4">
            <dt class="text-stone-500 shrink-0">Duration</dt>
            <dd class="font-medium text-stone-900 text-right">{{ selected.service.duration }} minutes</dd>
          </div>
          <div class="flex justify-between items-start gap-4">
            <dt class="text-stone-500 shrink-0">Price</dt>
            <dd class="text-right">
              <template v-if="loyaltyDiscountPct > 0">
                <span class="text-stone-400 line-through text-sm mr-1">£{{ selected.service.price }}</span>
                <span class="font-semibold text-rose-600">£{{ discountedPrice(selected.service.price) }}</span>
                <p class="text-xs text-rose-500 mt-0.5">{{ loyaltyDiscountPct }}% discount applied</p>
              </template>
              <span v-else class="font-semibold text-rose-600">£{{ selected.service.price }}</span>
            </dd>
          </div>
          <div class="border-t border-stone-100 my-3" />
          <div class="flex justify-between items-start gap-4">
            <dt class="text-stone-500 shrink-0">Date</dt>
            <dd class="font-medium text-stone-900 text-right">{{ formattedDate }}</dd>
          </div>
          <div class="flex justify-between items-start gap-4">
            <dt class="text-stone-500 shrink-0">Time</dt>
            <dd class="font-medium text-stone-900 text-right">{{ selected.time }}</dd>
          </div>
          <div class="border-t border-stone-100 my-3" />
          <div class="flex justify-between items-start gap-4">
            <dt class="text-stone-500 shrink-0">Name</dt>
            <dd class="font-medium text-stone-900 text-right">{{ authStore.userProfile?.name }}</dd>
          </div>
        </dl>

        <div class="mt-4">
          <label for="booking-notes" class="label">Notes for the stylist <span class="text-stone-400 font-normal">(optional)</span></label>
          <textarea id="booking-notes" v-model="selected.notes" class="input resize-none" rows="3" placeholder="Any special requests?" />
        </div>

        <!-- Deposit notice -->
        <div class="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-sm text-amber-800">
          <span class="text-base mt-0.5">💳</span>
          <p>A <strong>£10 deposit</strong> is required to secure your booking. This will be deducted from your total on the day.</p>
        </div>
      </div>

      <div class="flex justify-between">
        <button @click="step = 2" class="btn-secondary">Back</button>
        <button @click="step = 4" class="btn-primary">
          Continue to payment <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>

    <!-- Step 4: Pay deposit -->
    <div v-if="step === 4">
      <div class="card p-6 mb-6">
        <h3 class="font-semibold text-stone-900 mb-1">Pay £10 deposit</h3>
        <p class="text-stone-500 text-sm mb-5">Secures your appointment. The balance is paid on the day.</p>

        <div class="bg-stone-50 rounded-xl p-4 mb-5 text-sm space-y-2">
          <div class="flex justify-between">
            <span class="text-stone-500">Service</span>
            <span class="font-medium text-stone-900">{{ selected.service?.name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-stone-500">Date</span>
            <span class="font-medium text-stone-900">{{ formattedDate }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-stone-500">Time</span>
            <span class="font-medium text-stone-900">{{ selected.time }}</span>
          </div>
          <div class="border-t border-stone-200 pt-2 mt-1 flex justify-between">
            <span class="font-medium text-stone-700">Deposit due now</span>
            <span class="font-bold text-rose-600">£10.00</span>
          </div>
        </div>

        <!-- Card element -->
        <div v-if="!stripeReady && !paymentError" class="flex justify-center py-6">
          <AppSpinner size="lg" />
        </div>

        <div v-if="paymentError" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          {{ paymentError }}
        </div>

        <div ref="cardElementRef" class="border border-stone-300 rounded-xl px-4 py-3.5 bg-white" />

        <p class="text-xs text-stone-400 mt-3 flex items-center gap-1">
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          Payments are secured by Stripe. Your card details are never stored on our servers.
        </p>
      </div>

      <div class="flex justify-between">
        <button @click="step = 3" class="btn-secondary" :disabled="paying">Back</button>
        <button @click="payDeposit" class="btn-primary" :disabled="paying || !stripeReady">
          <AppSpinner v-if="paying" size="sm" />
          {{ paying ? 'Processing…' : 'Pay £10 deposit' }}
        </button>
      </div>
    </div>

    <!-- Success -->
    <div v-if="step === 5" class="text-center py-12">
      <div class="text-6xl mb-4">🎉</div>
      <h2 class="font-display text-2xl font-semibold text-stone-900 mb-2">You're booked!</h2>
      <p class="text-stone-500 mb-2">Your appointment is confirmed and your £10 deposit has been taken.</p>
      <p class="text-stone-400 text-sm mb-8">We'll see you soon!</p>
      <div class="flex gap-3 justify-center">
        <RouterLink to="/my-appointments" class="btn-primary">View my appointments</RouterLink>
        <RouterLink to="/" class="btn-secondary">Go home</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { useAuthStore } from '@/stores/auth'
import { useServicesStore } from '@/stores/services'
import { useAppointmentsStore } from '@/stores/appointments'
import { useAvailabilityStore } from '@/stores/availability'
import { useLoyaltyStore } from '@/stores/loyalty'
import { app } from '@/firebase/config'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import { sendBookingConfirmation } from '@/utils/email'

const authStore = useAuthStore()
const servicesStore = useServicesStore()
const appointmentsStore = useAppointmentsStore()
const availabilityStore = useAvailabilityStore()
const loyaltyStore = useLoyaltyStore()

const step = ref(1)
const steps = ['Choose service', 'Date & time', 'Confirm', 'Pay deposit']

const loyaltyDiscountPct = computed(() => loyaltyStore.myLoyalty?.discountPercent || 0)

function discountedPrice(price) {
  if (loyaltyDiscountPct.value === 0) return price.toFixed(2)
  return (Math.round(price * (1 - loyaltyDiscountPct.value / 100) * 100) / 100).toFixed(2)
}

const discountLabel = computed(() => {
  if (loyaltyDiscountPct.value > 0) {
    const tier = loyaltyStore.myLoyalty?.tier
    const label = tier === 'gold' ? 'Gold' : 'Silver'
    return `✨ ${loyaltyDiscountPct.value}% ${label} loyalty discount applied`
  }
  return null
})

const selected = ref({ service: null, date: '', time: '', notes: '' })
const availableSlots = ref([])
const timeSlotsLoading = ref(false)
const slotError = ref('')

const tomorrow = (() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().split('T')[0]
})()

const formattedDate = computed(() => {
  if (!selected.value.date) return ''
  return new Date(selected.value.date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
})

// Payment
const cardElementRef = ref(null)
const stripeReady = ref(false)
const paying = ref(false)
const paymentError = ref('')
let stripeInstance = null
let cardElement = null
let clientSecret = ''

watch(step, async (newStep) => {
  if (newStep === 4) {
    stripeReady.value = false
    paymentError.value = ''
    await nextTick()
    await initPayment()
  }
})

async function initPayment() {
  try {
    const fns = getFunctions(app, 'europe-west2')
    const createPaymentIntent = httpsCallable(fns, 'createPaymentIntent')
    const result = await createPaymentIntent({
      serviceName: selected.value.service.name,
      customerName: authStore.userProfile.name,
    })
    clientSecret = result.data.clientSecret

    stripeInstance = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
    const elements = stripeInstance.elements()
    cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '15px',
          color: '#1c1917',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          '::placeholder': { color: '#a8a29e' }
        }
      }
    })
    cardElement.mount(cardElementRef.value)
    stripeReady.value = true
  } catch (err) {
    paymentError.value = 'Could not initialise payment. Please try again.'
    console.error(err)
  }
}

async function payDeposit() {
  if (!stripeInstance || !cardElement) return
  paying.value = true
  paymentError.value = ''

  const { error, paymentIntent } = await stripeInstance.confirmCardPayment(clientSecret, {
    payment_method: { card: cardElement }
  })

  if (error) {
    paymentError.value = error.message
    paying.value = false
    return
  }

  try {
    await saveBooking(paymentIntent.id)
    step.value = 5
  } catch {
    paymentError.value = 'Payment succeeded but booking failed. Please contact us immediately.'
  } finally {
    paying.value = false
  }
}

async function saveBooking(paymentIntentId) {
  const originalPrice = selected.value.service.price
  const finalPrice = loyaltyDiscountPct.value > 0
    ? Math.round(originalPrice * (1 - loyaltyDiscountPct.value / 100) * 100) / 100
    : originalPrice

  await appointmentsStore.bookAppointment({
    userId: authStore.user.uid,
    userName: authStore.userProfile.name,
    userEmail: authStore.user.email,
    serviceId: selected.value.service.id,
    serviceName: selected.value.service.name,
    servicePrice: originalPrice,
    finalPrice,
    discountPercent: loyaltyDiscountPct.value,
    loyaltyTier: loyaltyStore.myLoyalty?.tier || 'bronze',
    serviceDuration: selected.value.service.duration,
    date: selected.value.date,
    time: selected.value.time,
    notes: selected.value.notes,
    depositPaid: true,
    depositAmount: 10,
    stripePaymentIntentId: paymentIntentId,
  })

  sendBookingConfirmation({
    userName: authStore.userProfile.name,
    userEmail: authStore.user.email,
    serviceName: selected.value.service.name,
    date: selected.value.date,
    time: selected.value.time,
    duration: selected.value.service.duration,
    price: selected.value.service.price,
    notes: selected.value.notes,
  }).catch(() => {})
}

onMounted(() => {
  servicesStore.fetchServices(true)
  if (authStore.user?.uid) loyaltyStore.fetchMyLoyalty(authStore.user.uid)
})

function selectService(s) {
  selected.value.service = s
}

async function loadTimeSlots() {
  selected.value.time = ''
  slotError.value = ''
  timeSlotsLoading.value = true
  try {
    const [allSlots, booked] = await Promise.all([
      availabilityStore.getSlotsForDate(selected.value.date),
      appointmentsStore.getBookedSlots(selected.value.date).catch(() => [])
    ])
    availableSlots.value = allSlots.filter(s => !booked.includes(s))
  } catch {
    slotError.value = 'Could not load time slots. Please try again.'
    availableSlots.value = []
  } finally {
    timeSlotsLoading.value = false
  }
}
</script>
