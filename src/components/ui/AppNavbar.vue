<template>
  <header class="bg-[#D4769E] sticky top-0 z-50 shadow-md">
    <nav class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-3">
        <img src="/IMG_0046.jpg" alt="The Nail Club" class="h-10 w-10 rounded-full object-cover border-2 border-white/40 shadow-sm" />
        <span class="font-display text-2xl text-white drop-shadow-sm">The Nail Club</span>
      </RouterLink>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-6">
        <RouterLink to="/" class="text-sm text-white/90 hover:text-white transition-colors font-medium">Home</RouterLink>
        <RouterLink to="/membership" class="text-sm text-white/90 hover:text-white transition-colors font-medium">Loyalty</RouterLink>
        <RouterLink to="/reviews" class="text-sm text-white/90 hover:text-white transition-colors font-medium">Reviews</RouterLink>
        <template v-if="authStore.isLoggedIn">
          <RouterLink to="/booking" class="text-sm text-white/90 hover:text-white transition-colors font-medium">Book</RouterLink>
          <RouterLink to="/my-appointments" class="text-sm text-white/90 hover:text-white transition-colors font-medium">My Appointments</RouterLink>
          <RouterLink v-if="authStore.isAdmin" to="/admin" class="text-sm text-white/90 hover:text-white transition-colors font-medium">Admin</RouterLink>
          <button @click="handleLogout" class="btn-nav-outline text-sm">Sign out</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="text-sm text-white/90 hover:text-white transition-colors font-medium">Sign in</RouterLink>
          <RouterLink to="/register" class="btn-nav text-sm">Book now</RouterLink>
        </template>
      </div>

      <!-- Mobile menu button -->
      <button @click="mobileOpen = !mobileOpen" class="md:hidden p-2 rounded-lg text-white hover:bg-white/20">
        <svg v-if="!mobileOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </nav>

    <!-- Mobile menu -->
    <div v-if="mobileOpen" class="md:hidden bg-[#c2517a] border-t border-white/20 px-4 py-4 space-y-1">
      <RouterLink @click="mobileOpen = false" to="/" class="block text-sm text-white py-2.5 px-3 rounded-lg hover:bg-white/10">Home</RouterLink>
      <RouterLink @click="mobileOpen = false" to="/membership" class="block text-sm text-white py-2.5 px-3 rounded-lg hover:bg-white/10">Loyalty</RouterLink>
      <RouterLink @click="mobileOpen = false" to="/reviews" class="block text-sm text-white py-2.5 px-3 rounded-lg hover:bg-white/10">Reviews</RouterLink>
      <template v-if="authStore.isLoggedIn">
        <RouterLink @click="mobileOpen = false" to="/booking" class="block text-sm text-white py-2.5 px-3 rounded-lg hover:bg-white/10">Book Appointment</RouterLink>
        <RouterLink @click="mobileOpen = false" to="/my-appointments" class="block text-sm text-white py-2.5 px-3 rounded-lg hover:bg-white/10">My Appointments</RouterLink>
        <RouterLink v-if="authStore.isAdmin" @click="mobileOpen = false" to="/admin" class="block text-sm text-white py-2.5 px-3 rounded-lg hover:bg-white/10">Admin Dashboard</RouterLink>
        <button @click="handleLogout" class="block text-sm text-white/70 py-2.5 px-3 w-full text-left hover:bg-white/10 rounded-lg">Sign out</button>
      </template>
      <template v-else>
        <RouterLink @click="mobileOpen = false" to="/login" class="block text-sm text-white py-2.5 px-3 rounded-lg hover:bg-white/10">Sign in</RouterLink>
        <RouterLink @click="mobileOpen = false" to="/register" class="block text-sm font-semibold text-[#D4769E] bg-white py-2.5 px-3 rounded-lg text-center mt-2">Book now</RouterLink>
      </template>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const mobileOpen = ref(false)

async function handleLogout() {
  await authStore.logout()
  router.push('/')
  mobileOpen.value = false
}
</script>

<style scoped>
.btn-nav {
  @apply inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg font-semibold transition-all duration-200 bg-white text-[#D4769E] hover:bg-rose-50;
}
.btn-nav-outline {
  @apply inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-lg font-medium transition-all duration-200 border border-white/60 text-white hover:bg-white/20;
}
</style>
