<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
    <div class="mb-8">
      <h1 class="font-display text-4xl text-[#D4769E]">Client Reviews</h1>
      <p class="text-stone-500 mt-1">See what our clients are saying</p>
    </div>

    <!-- Approved reviews -->
    <div v-if="store.loading" class="flex justify-center py-20"><AppSpinner size="lg" /></div>

    <div v-else-if="store.reviews.length === 0" class="card p-12 text-center text-stone-400 mb-10">
      No reviews yet — be the first to leave one!
    </div>

    <div v-else class="space-y-4 mb-12">
      <div v-for="review in store.reviews" :key="review.id" class="card p-6">
        <div class="flex items-start justify-between gap-4 mb-3">
          <div>
            <p class="font-semibold text-stone-900">{{ review.userName }}</p>
            <p class="text-xs text-stone-400 mt-0.5">{{ formatDate(review.createdAt) }}</p>
          </div>
          <StarRating :model-value="review.rating" />
        </div>
        <p class="text-stone-600 text-sm leading-relaxed">{{ review.comment }}</p>
      </div>
    </div>

    <!-- Submit form -->
    <div class="card p-6">
      <h2 class="font-semibold text-stone-900 mb-1">Leave a review</h2>

      <template v-if="!authStore.isLoggedIn">
        <p class="text-stone-500 text-sm">
          <RouterLink to="/login" class="text-rose-500 hover:underline">Sign in</RouterLink>
          to leave a review.
        </p>
      </template>

      <template v-else-if="submitted">
        <div class="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
          Thank you! Your review has been submitted and is awaiting approval.
        </div>
      </template>

      <template v-else>
        <p class="text-stone-500 text-sm mb-4">Share your experience with The Nail Club</p>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="label">Your rating</label>
            <StarRating v-model="form.rating" :interactive="true" />
            <p v-if="ratingError" class="text-red-500 text-xs mt-1">Please select a rating.</p>
          </div>
          <div>
            <label class="label">Your review</label>
            <textarea
              v-model="form.comment"
              class="input resize-none"
              rows="4"
              placeholder="Tell us about your experience..."
              maxlength="500"
            />
          </div>
          <div v-if="submitError" class="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {{ submitError }}
          </div>
          <button type="submit" class="btn-primary" :disabled="submitting">
            <AppSpinner v-if="submitting" size="sm" />
            {{ submitting ? 'Submitting…' : 'Submit review' }}
          </button>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useReviewsStore } from '@/stores/reviews'
import StarRating from '@/components/ui/StarRating.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const authStore = useAuthStore()
const store = useReviewsStore()

const form = ref({ rating: 0, comment: '' })
const submitting = ref(false)
const submitted = ref(false)
const submitError = ref('')
const ratingError = ref(false)

onMounted(() => store.fetchApprovedReviews())

function formatDate(ts) {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function handleSubmit() {
  submitError.value = ''
  ratingError.value = false
  if (!form.value.rating) { ratingError.value = true; return }
  if (!form.value.comment.trim()) return

  submitting.value = true
  try {
    await store.submitReview({
      userId: authStore.user.uid,
      userName: authStore.userProfile.name,
      rating: form.value.rating,
      comment: form.value.comment.trim()
    })
    submitted.value = true
  } catch {
    submitError.value = 'Failed to submit your review. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
