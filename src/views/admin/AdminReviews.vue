<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-10">
    <div class="mb-8">
      <h1 class="font-display text-4xl text-[#D4769E]">Reviews</h1>
      <p class="text-stone-500 mt-1">Approve or reject customer reviews before they go live</p>
    </div>

    <div v-if="store.loading" class="flex justify-center py-20"><AppSpinner size="lg" /></div>

    <div v-else-if="store.allReviews.length === 0" class="card p-12 text-center text-stone-400">
      No reviews submitted yet.
    </div>

    <div v-else class="card overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-stone-200 bg-stone-50">
            <th class="text-left px-5 py-3 font-medium text-stone-600">Reviewer</th>
            <th class="text-left px-5 py-3 font-medium text-stone-600">Rating</th>
            <th class="text-left px-5 py-3 font-medium text-stone-600">Comment</th>
            <th class="text-left px-5 py-3 font-medium text-stone-600">Date</th>
            <th class="text-left px-5 py-3 font-medium text-stone-600">Status</th>
            <th class="text-left px-5 py-3 font-medium text-stone-600">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100">
          <tr v-for="review in store.allReviews" :key="review.id" class="hover:bg-stone-50 transition-colors align-top">
            <td class="px-5 py-4 font-medium text-stone-900 whitespace-nowrap">{{ review.userName }}</td>
            <td class="px-5 py-4">
              <StarRating :model-value="review.rating" />
            </td>
            <td class="px-5 py-4 text-stone-600 max-w-xs">
              <p class="line-clamp-2">{{ review.comment }}</p>
            </td>
            <td class="px-5 py-4 text-stone-500 whitespace-nowrap">{{ formatDate(review.createdAt) }}</td>
            <td class="px-5 py-4">
              <span :class="statusBadge(review.status)">{{ review.status }}</span>
            </td>
            <td class="px-5 py-4">
              <div class="flex gap-2 flex-wrap">
                <button
                  v-if="review.status !== 'approved'"
                  @click="setStatus(review.id, 'approved')"
                  :disabled="saving === review.id"
                  class="btn bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1"
                >
                  Approve
                </button>
                <button
                  v-if="review.status !== 'rejected'"
                  @click="setStatus(review.id, 'rejected')"
                  :disabled="saving === review.id"
                  class="btn bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1"
                >
                  Reject
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useReviewsStore } from '@/stores/reviews'
import StarRating from '@/components/ui/StarRating.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const store = useReviewsStore()
const saving = ref(null)

onMounted(() => store.fetchAllReviews())

function formatDate(ts) {
  if (!ts) return ''
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusBadge(status) {
  return {
    pending: 'badge badge-pending',
    approved: 'badge badge-confirmed',
    rejected: 'badge badge-cancelled'
  }[status] || 'badge'
}

async function setStatus(id, status) {
  saving.value = id
  try {
    await store.updateReviewStatus(id, status)
  } finally {
    saving.value = null
  }
}
</script>
