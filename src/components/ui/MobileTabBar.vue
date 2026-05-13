<template>
  <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-200 shadow-lg">
    <div class="flex items-stretch" style="padding-bottom: env(safe-area-inset-bottom)">
      <RouterLink
        v-for="tab in visibleTabs"
        :key="tab.to"
        :to="tab.to"
        class="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] transition-colors"
        :class="isActive(tab) ? 'text-[#D4769E]' : 'text-stone-400'"
      >
        <component :is="tab.icon" class="h-6 w-6" :class="isActive(tab) ? 'text-[#D4769E]' : 'text-stone-400'" />
        <span class="text-[10px] font-medium leading-none">{{ tab.label }}</span>
        <span v-if="isActive(tab)" class="absolute bottom-0 h-0.5 w-8 bg-[#D4769E] rounded-full" style="margin-bottom: env(safe-area-inset-bottom)" />
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { computed, h } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()

function isActive(tab) {
  if (tab.exact) return route.path === tab.to
  return route.path === tab.to || route.path.startsWith(tab.to + '/')
}

// SVG icon components defined inline — no extra deps
const HomeIcon = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' })
]) }

const CalendarIcon = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
]) }

const ListIcon = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' })
]) }

const UserIcon = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' })
]) }

const AdminIcon = { render: () => h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
]) }

const allTabs = computed(() => {
  if (!authStore.isLoggedIn) {
    return [
      { to: '/', label: 'Home', icon: HomeIcon, exact: true },
      { to: '/reviews', label: 'Reviews', icon: ListIcon },
      { to: '/login', label: 'Sign In', icon: UserIcon },
    ]
  }

  const tabs = [
    { to: '/', label: 'Home', icon: HomeIcon, exact: true },
    { to: '/booking', label: 'Book', icon: CalendarIcon },
    { to: '/my-appointments', label: 'Appointments', icon: ListIcon },
  ]

  if (authStore.isAdmin) {
    tabs.push({ to: '/admin', label: 'Admin', icon: AdminIcon })
  } else {
    tabs.push({ to: '/reviews', label: 'Reviews', icon: ListIcon })
  }

  tabs.push({ to: '/membership', label: 'Loyalty', icon: UserIcon })

  return tabs
})

const visibleTabs = computed(() => allTabs.value.slice(0, 5))
</script>
