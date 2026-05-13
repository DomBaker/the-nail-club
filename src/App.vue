<template>
  <div class="min-h-screen flex flex-col" :class="{ 'native-app': isNative }">
    <!-- Firebase not configured banner -->
    <div v-if="!isConfigured" class="min-h-screen flex items-center justify-center bg-rose-50 px-4">
      <div class="max-w-lg w-full text-center">
        <img src="/IMG_0046.jpg" alt="The Nail Club" class="h-32 w-32 rounded-3xl object-cover mx-auto shadow-lg mb-6" />
        <h1 class="font-display text-4xl text-[#D4769E] mb-3">The Nail Club</h1>
        <div class="card p-6 text-left">
          <h2 class="font-semibold text-stone-900 mb-3">Firebase setup required</h2>
          <p class="text-stone-500 text-sm mb-4">
            Create a <code class="bg-stone-100 px-1.5 py-0.5 rounded text-rose-600 font-mono">.env</code> file in the project root with your Firebase config keys:
          </p>
          <pre class="bg-stone-900 text-green-400 text-xs rounded-lg p-4 overflow-x-auto leading-relaxed">VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id</pre>
          <p class="text-stone-400 text-xs mt-4">
            Get these values from <strong>Firebase Console → Project Settings → Your apps</strong>, then restart the dev server.
          </p>
        </div>
      </div>
    </div>

    <!-- App (shown once Firebase is configured) -->
    <template v-else>
      <!-- On native: status bar safe area spacer -->
      <div v-if="isNative" class="bg-[#D4769E] pt-safe" />

      <AppNavbar v-if="!authStore.loading" />

      <main class="flex-1" :class="isNative ? 'pb-tab-bar' : ''">
        <RouterView v-if="!authStore.loading" />
        <div v-else class="flex items-center justify-center min-h-screen">
          <AppSpinner size="lg" />
        </div>
      </main>

      <!-- Footer only on web -->
      <AppFooter v-if="!authStore.loading && !isNative" />

      <!-- Bottom tab bar only in native app -->
      <MobileTabBar v-if="!authStore.loading && isNative" />
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { isConfigured } from '@/firebase/config'
import { useCapacitor } from '@/composables/useCapacitor'
import AppNavbar from '@/components/ui/AppNavbar.vue'
import AppFooter from '@/components/ui/AppFooter.vue'
import AppSpinner from '@/components/ui/AppSpinner.vue'
import MobileTabBar from '@/components/ui/MobileTabBar.vue'

const authStore = useAuthStore()
const { isNative } = useCapacitor()

onMounted(async () => {
  await authStore.init()
})
</script>

<style>
.pb-tab-bar {
  /* Tab bar is 56px + bottom safe area */
  padding-bottom: calc(56px + env(safe-area-inset-bottom));
}
</style>
