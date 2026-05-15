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

      <!-- Floating social buttons (web only) -->
      <div v-if="!isNative" class="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
        <a
          href="https://www.instagram.com/thenailclubx_?igsh=cm13dzU5eTNvMDc1&utm_source=qr"
          target="_blank"
          rel="noopener"
          aria-label="Instagram"
          class="h-14 w-14 rounded-full bg-[#D4769E] shadow-lg hover:bg-rose-500 transition-colors flex items-center justify-center"
        >
          <svg class="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
          </svg>
        </a>
        <a
          href="https://www.facebook.com/share/1Hdfig83EX/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener"
          aria-label="Facebook"
          class="h-14 w-14 rounded-full bg-[#D4769E] shadow-lg hover:bg-rose-500 transition-colors flex items-center justify-center"
        >
          <svg class="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <a
          href="https://m.me/1024022510799406"
          target="_blank"
          rel="noopener"
          aria-label="Message us on Messenger"
          class="h-14 w-14 rounded-full bg-[#D4769E] shadow-lg hover:bg-rose-500 transition-colors flex items-center justify-center"
        >
          <svg class="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.504 3.686 7.205V22l3.371-1.85c.9.249 1.853.384 2.943.384 5.523 0 10-4.145 10-9.291C22 6.145 17.523 2 12 2zm1.008 12.502l-2.548-2.718-4.976 2.718 5.474-5.808 2.61 2.718 4.913-2.718-5.473 5.808z"/>
          </svg>
        </a>
      </div>
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
