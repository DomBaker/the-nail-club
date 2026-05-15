<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden bg-[#D4769E] py-16 sm:py-24">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-10 md:gap-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <img
            src="/IMG_0046.jpg"
            alt="The Nail Club"
            class="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl object-cover shadow-2xl border-4 border-white/30"
          />
        </div>
        <!-- Copy -->
        <div class="text-center md:text-left">
          <h1 class="font-display text-5xl sm:text-6xl text-white leading-tight mb-4 drop-shadow-md">
            The Nail Club
          </h1>
          <p class="text-white/85 text-lg max-w-md mb-8 leading-relaxed">
            Book your perfect nail appointment online. Choose your service, pick your time, and let us pamper you.
          </p>
          <div class="flex gap-3 justify-center md:justify-start flex-wrap">
            <RouterLink to="/booking" class="inline-flex items-center gap-2 bg-white text-[#D4769E] font-semibold px-6 py-3 rounded-xl hover:bg-rose-50 transition-colors shadow-md">
              Book an appointment
            </RouterLink>
            <button @click="scrollToServices" class="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
              View services
            </button>
          </div>
        </div>
      </div>

      <!-- Decorative circles -->
      <div class="absolute -top-20 -right-20 h-72 w-72 bg-rose-300 rounded-full opacity-25 blur-3xl pointer-events-none" />
      <div class="absolute -bottom-20 -left-20 h-72 w-72 bg-pink-200 rounded-full opacity-25 blur-3xl pointer-events-none" />
    </section>

    <!-- Features -->
    <section class="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div class="grid sm:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="text-5xl mb-4">📅</div>
          <h3 class="font-semibold text-stone-900 mb-2">Easy online booking</h3>
          <p class="text-stone-500 text-sm">Book your appointment 24/7 from any device — no phone calls needed.</p>
        </div>
        <div class="text-center">
          <div class="text-5xl mb-4">🍒</div>
          <h3 class="font-semibold text-stone-900 mb-2">Expert nail artists</h3>
          <p class="text-stone-500 text-sm">Our experienced team delivers flawless results every time.</p>
        </div>
        <div class="text-center">
          <div class="text-5xl mb-4">🪩</div>
          <h3 class="font-semibold text-stone-900 mb-2">Premium products</h3>
          <p class="text-stone-500 text-sm">We use only the highest quality, long-lasting nail products.</p>
        </div>
      </div>
    </section>

    <!-- Services preview -->
    <section id="services" class="bg-rose-50 py-16 sm:py-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center mb-10">
          <h2 class="font-display text-4xl text-[#D4769E] mb-2">Our Services</h2>
          <p class="text-stone-500">Treat yourself to one of our signature treatments</p>
        </div>

        <div v-if="servicesStore.loading" class="flex justify-center py-12"><AppSpinner size="lg" /></div>

        <div v-else-if="servicesStore.services.length === 0" class="text-center text-stone-400 py-12">
          Services coming soon — check back shortly!
        </div>

        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="s in servicesStore.services" :key="s.id" class="card p-5 hover:shadow-md transition-shadow">
            <h3 class="font-semibold text-stone-900">{{ s.name }}</h3>
            <p class="text-sm text-stone-500 mt-1 mb-4">{{ s.description }}</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="font-semibold text-rose-600">£{{ s.price }}</span>
                <span class="text-stone-400 text-sm">{{ s.duration }} min</span>
              </div>
              <RouterLink to="/booking" class="text-sm text-rose-600 font-medium hover:underline">Book →</RouterLink>
            </div>
          </div>
        </div>

        <div class="text-center mt-10">
          <RouterLink to="/booking" class="btn-primary text-base px-6 py-3">Book your appointment</RouterLink>
        </div>
      </div>
    </section>

    <!-- Reviews -->
    <section v-if="reviewsStore.reviews.length > 0" class="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div class="text-center mb-10">
        <h2 class="font-display text-4xl text-[#D4769E] mb-2">What our clients say</h2>
        <p class="text-stone-500">Real reviews from real clients</p>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="review in reviewsStore.reviews.slice(0, 6)" :key="review.id" class="card p-5">
          <div class="flex items-center justify-between mb-3">
            <StarRating :model-value="review.rating" />
            <span class="text-xs text-stone-400">{{ formatReviewDate(review.createdAt) }}</span>
          </div>
          <p class="text-stone-600 text-sm leading-relaxed line-clamp-4 mb-3">{{ review.comment }}</p>
          <p class="text-xs font-medium text-stone-500">— {{ review.userName }}</p>
        </div>
      </div>
      <div class="text-center mt-8">
        <RouterLink to="/reviews" class="btn-secondary text-sm">See all reviews</RouterLink>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-[#D4769E] py-16">
      <div class="max-w-2xl mx-auto px-4 text-center">
        <h2 class="font-display text-4xl text-white mb-4 drop-shadow-sm">Ready to treat yourself?</h2>
        <p class="text-white/80 mb-8 text-lg">Join our community of happy clients and book your next nail appointment today.</p>
        <RouterLink v-if="!authStore.isLoggedIn" to="/register" class="inline-flex items-center gap-2 bg-white text-[#D4769E] font-semibold px-6 py-3 rounded-xl hover:bg-rose-50 transition-colors shadow-md">
          Get started for free
        </RouterLink>
        <RouterLink v-else to="/booking" class="inline-flex items-center gap-2 bg-white text-[#D4769E] font-semibold px-6 py-3 rounded-xl hover:bg-rose-50 transition-colors shadow-md">
          Book now
        </RouterLink>
      </div>
    </section>

  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useServicesStore } from '@/stores/services'
import { useReviewsStore } from '@/stores/reviews'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import StarRating from '@/components/ui/StarRating.vue'

const authStore = useAuthStore()
const servicesStore = useServicesStore()
const reviewsStore = useReviewsStore()

onMounted(() => {
  servicesStore.fetchServices(true)
  reviewsStore.fetchApprovedReviews()
})

function scrollToServices() {
  const el = document.getElementById('services')
  if (!el) return
  const offset = 72 // navbar height
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}

function formatReviewDate(ts) {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}
</script>
