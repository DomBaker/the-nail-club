<template>
  <div
    class="relative rounded-2xl overflow-hidden select-none"
    :class="[cardGradient, state === 'locked' ? 'opacity-50 grayscale' : '']"
    style="aspect-ratio: 1.6 / 1; min-width: 260px;"
  >
    <!-- Decorative circles -->
    <div class="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10" />
    <div class="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-black/10" />

    <div class="relative h-full flex flex-col justify-between p-5">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-xl">🍒</span>
          <span class="font-display text-lg leading-none" :class="textColor">The Nail Club</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span v-if="state === 'locked'" class="text-sm" :class="textMuted">🔒</span>
          <span v-else-if="state === 'completed'" class="text-sm">✅</span>
          <span
            class="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
            :class="tierBadgeClass"
          >{{ tier }}</span>
        </div>
      </div>

      <!-- Stamps grid -->
      <div class="flex items-center gap-2 justify-center py-1">
        <div
          v-for="i in 6"
          :key="i"
          class="flex items-center justify-center rounded-full transition-all"
          :class="[
            i <= filledStamps ? 'bg-white/25 shadow-sm' : 'border-2 opacity-60',
            stampSize,
            i <= filledStamps ? '' : borderColor
          ]"
        >
          <span v-if="i <= filledStamps" :class="stampIconSize">🍒</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-end justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider" :class="textMuted">{{ benefitLabel }}</p>
          <p class="text-sm font-bold leading-tight mt-0.5" :class="textColor">{{ benefitValue }}</p>
        </div>
        <div class="text-right">
          <p class="text-xs" :class="textMuted">{{ filledStamps }}/6 stamps</p>
          <p v-if="state === 'active' && filledStamps < 6" class="text-xs font-medium" :class="textColor">
            {{ 6 - filledStamps }} more to go
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tier: { type: String, required: true },     // 'bronze'|'silver'|'gold'
  state: { type: String, default: 'active' }, // 'locked'|'active'|'completed'
  filledStamps: { type: Number, default: 0 },
})

const config = {
  bronze: {
    gradient: 'bg-gradient-to-br from-amber-700 to-amber-900',
    textColor: 'text-amber-100',
    textMuted: 'text-amber-300/70',
    border: 'border-amber-300/50',
    badge: 'bg-amber-900/60 text-amber-200',
    benefit: { label: 'Starting tier', value: 'Earn your way to Silver' },
  },
  silver: {
    gradient: 'bg-gradient-to-br from-slate-400 to-slate-600',
    textColor: 'text-slate-100',
    textMuted: 'text-slate-300/70',
    border: 'border-slate-300/50',
    badge: 'bg-slate-700/60 text-slate-200',
    benefit: { label: 'Member benefit', value: '5% off every treatment' },
  },
  gold: {
    gradient: 'bg-gradient-to-br from-yellow-500 to-amber-600',
    textColor: 'text-yellow-900',
    textMuted: 'text-yellow-800/70',
    border: 'border-yellow-300/60',
    badge: 'bg-yellow-900/30 text-yellow-900',
    benefit: { label: 'Member benefits', value: '10% off + exclusive perks' },
  },
}

const c = computed(() => config[props.tier] || config.bronze)
const cardGradient = computed(() => c.value.gradient)
const textColor = computed(() => c.value.textColor)
const textMuted = computed(() => c.value.textMuted)
const borderColor = computed(() => c.value.border)
const tierBadgeClass = computed(() => c.value.badge)
const benefitLabel = computed(() => c.value.benefit.label)
const benefitValue = computed(() => c.value.benefit.value)

const stampSize = 'h-9 w-9'
const stampIconSize = 'text-base'
</script>
