<template>
  <div>
    <!-- Active discount banner -->
    <div v-if="loyalty?.discountPercent > 0" class="mb-4 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3">
      <span class="text-2xl">✨</span>
      <div>
        <p class="font-semibold text-rose-800">{{ loyalty.discountPercent }}% loyalty discount active</p>
        <p class="text-sm text-rose-600">
          Your {{ TIER_NAMES[loyalty.tier] }} membership saves you {{ loyalty.discountPercent }}% on every booking.
          <template v-if="loyalty.tier === 'gold'"> Plus exclusive Gold perks — ask your stylist!</template>
        </p>
      </div>
    </div>

    <!-- Section heading -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-display text-xl text-[#D4769E]">My Loyalty Cards</h2>
      <span v-if="loyalty" class="text-sm text-stone-500">
        {{ loyalty.totalStamps || 0 }} total stamp{{ (loyalty.totalStamps || 0) === 1 ? '' : 's' }}
      </span>
    </div>

    <div v-if="loading" class="flex justify-center py-8"><AppSpinner size="lg" /></div>

    <!-- 3 cards — horizontal scroll -->
    <div v-else class="flex gap-4 overflow-x-auto pb-2" style="-webkit-overflow-scrolling: touch; scrollbar-width: none;">
      <LoyaltyCard
        tier="bronze"
        :state="bronzeCard.state"
        :filledStamps="bronzeCard.filledStamps"
        class="flex-shrink-0"
        style="width: 64%;"
      />
      <LoyaltyCard
        tier="silver"
        :state="silverCard.state"
        :filledStamps="silverCard.filledStamps"
        class="flex-shrink-0"
        style="width: 64%;"
      />
      <LoyaltyCard
        tier="gold"
        :state="goldCard.state"
        :filledStamps="goldCard.filledStamps"
        class="flex-shrink-0"
        style="width: 64%;"
      />
    </div>

    <!-- Progress hint -->
    <p v-if="nextRewardText && !loading" class="text-center text-stone-400 text-xs mt-3">{{ nextRewardText }}</p>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useLoyaltyStore } from '@/stores/loyalty'
import { useAuthStore } from '@/stores/auth'
import LoyaltyCard from './LoyaltyCard.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const loyaltyStore = useLoyaltyStore()
const authStore = useAuthStore()

const TIER_NAMES = { bronze: 'Bronze', silver: 'Silver', gold: 'Gold' }

onMounted(() => {
  if (authStore.user?.uid) loyaltyStore.fetchMyLoyalty(authStore.user.uid)
})

const loyalty = computed(() => loyaltyStore.myLoyalty)
const loading = computed(() => loyaltyStore.loading)
const total = computed(() => loyalty.value?.totalStamps || 0)

const bronzeCard = computed(() => ({
  state: total.value >= 6 ? 'completed' : 'active',
  filledStamps: Math.min(total.value, 6),
}))

const silverCard = computed(() => ({
  state: total.value < 6 ? 'locked' : total.value >= 12 ? 'completed' : 'active',
  filledStamps: total.value < 6 ? 0 : Math.min(total.value - 6, 6),
}))

const goldCard = computed(() => ({
  state: total.value < 12 ? 'locked' : 'active',
  filledStamps: total.value < 12 ? 0 : (total.value - 12) % 6,
}))

const nextRewardText = computed(() => {
  const t = total.value
  if (t < 6) return `${6 - t} more stamp${6 - t === 1 ? '' : 's'} until 5% Silver discount`
  if (t < 12) return `${12 - t} more stamp${12 - t === 1 ? '' : 's'} until Gold tier & exclusive perks`
  return null
})
</script>
