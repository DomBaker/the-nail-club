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
            <a href="#services" class="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
              View services
            </a>
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

    <!-- Footer -->
    <section class="bg-stone-900 py-10">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <p class="font-display text-xl text-white mb-4">The Nail Club</p>
        <div class="flex items-center justify-center gap-5 mb-6">
          <!-- Instagram -->
          <a
            href="https://www.instagram.com/thenailclubx_?igsh=cm13dzU5eTNvMDc1&utm_source=qr"
            target="_blank"
            rel="noopener"
            class="h-10 w-10 rounded-full bg-white/10 hover:bg-[#D4769E]/60 flex items-center justify-center text-white transition-colors"
            aria-label="Instagram"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
          </a>
          <!-- Facebook -->
          <a
            href="https://www.facebook.com/share/1Hdfig83EX/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener"
            class="h-10 w-10 rounded-full bg-white/10 hover:bg-[#D4769E]/60 flex items-center justify-center text-white transition-colors"
            aria-label="Facebook"
          >
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>
        <p class="text-stone-600 text-xs">&copy; {{ new Date().getFullYear() }} The Nail Club. All rights reserved.</p>
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

function formatReviewDate(ts) {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
}
</script>
