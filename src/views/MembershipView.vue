<template>
  <div>
    <!-- Hero -->
    <section class="bg-[#D4769E] py-14 sm:py-20 text-center px-4">
      <p class="text-white/70 text-sm font-medium uppercase tracking-widest mb-3">The Nail Club</p>
      <h1 class="font-display text-4xl sm:text-5xl text-white drop-shadow-sm mb-4">Loyalty Programme</h1>
      <p class="text-white/85 text-lg max-w-md mx-auto">Every visit earns you a stamp. Collect enough and unlock exclusive discounts and perks — automatically.</p>
    </section>

    <!-- How it works -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 py-14">
      <h2 class="font-display text-3xl text-center text-[#D4769E] mb-10">How it works</h2>
      <div class="grid sm:grid-cols-3 gap-6 text-center">
        <div class="flex flex-col items-center gap-3">
          <div class="h-14 w-14 rounded-2xl bg-[#D4769E]/10 flex items-center justify-center text-2xl">📅</div>
          <h3 class="font-semibold text-stone-900">1. Book & attend</h3>
          <p class="text-stone-500 text-sm">Book any treatment and show up. There's nothing extra to do.</p>
        </div>
        <div class="flex flex-col items-center gap-3">
          <div class="h-14 w-14 rounded-2xl bg-[#D4769E]/10 flex items-center justify-center text-2xl">🍒</div>
          <h3 class="font-semibold text-stone-900">2. Collect stamps</h3>
          <p class="text-stone-500 text-sm">Your stylist marks your visit and a stamp is added to your loyalty card.</p>
        </div>
        <div class="flex flex-col items-center gap-3">
          <div class="h-14 w-14 rounded-2xl bg-[#D4769E]/10 flex items-center justify-center text-2xl">🎀</div>
          <h3 class="font-semibold text-stone-900">3. Unlock rewards</h3>
          <p class="text-stone-500 text-sm">Fill your card to level up. Silver brings a discount. Gold brings exclusive perks.</p>
        </div>
      </div>
    </section>

    <!-- Tier cards -->
    <section class="bg-rose-50 py-14 px-4">
      <div class="max-w-5xl mx-auto">
        <h2 class="font-display text-3xl text-center text-[#D4769E] mb-3">The tiers</h2>
        <p class="text-center text-stone-500 mb-10">Three levels of loyalty. Progress is automatic — just keep visiting.</p>

        <div class="flex flex-col sm:flex-row items-stretch gap-4">

          <!-- Bronze -->
          <div class="flex-1 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-700 to-amber-900 p-6 relative">
            <div class="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/10" />
            <div class="relative">
              <span class="text-xs font-bold uppercase tracking-widest bg-amber-900/50 px-2 py-1 rounded-full text-amber-200">Bronze</span>
              <h3 class="font-display text-2xl mt-3 mb-1 text-amber-100">Starting point</h3>
              <p class="text-amber-300/80 text-sm mb-5">Every customer begins here. Collect 6 stamps to level up.</p>
              <div class="flex gap-1.5 mb-5">
                <div v-for="i in 6" :key="i" class="h-8 w-8 rounded-full border-2 border-amber-400/40 flex items-center justify-center text-sm">
                  <span v-if="i <= 2">🍒</span>
                </div>
              </div>
              <div class="border-t border-amber-600/50 pt-4 text-amber-100">
                <p class="text-xs text-amber-300/70 uppercase tracking-wide font-medium mb-2">Benefits</p>
                <p class="text-sm text-amber-200/70 italic">No benefits at this tier — keep collecting!</p>
              </div>
            </div>
          </div>

          <!-- Arrow -->
          <div class="hidden sm:flex items-center text-stone-300 text-2xl px-1 self-center">›</div>
          <div class="sm:hidden text-center text-stone-300 text-2xl">↓</div>

          <!-- Silver -->
          <div class="flex-1 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-400 to-slate-600 p-6 relative">
            <div class="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/10" />
            <div class="relative">
              <span class="text-xs font-bold uppercase tracking-widest bg-slate-700/50 px-2 py-1 rounded-full text-slate-200">Silver</span>
              <h3 class="font-display text-2xl mt-3 mb-1 text-slate-100">6 stamps</h3>
              <p class="text-slate-300/80 text-sm mb-5">Reached after your 6th stamp. Discount applies automatically to every booking.</p>
              <div class="flex gap-1.5 mb-5">
                <div v-for="i in 6" :key="i" class="h-8 w-8 rounded-full border-2 border-slate-300/40 flex items-center justify-center text-sm">
                  <span v-if="i <= 4">🍒</span>
                </div>
              </div>
              <div class="border-t border-slate-500/50 pt-4 text-slate-100">
                <p class="text-xs text-slate-300/70 uppercase tracking-wide font-medium mb-2">Benefits</p>
                <ul class="space-y-1.5 text-sm">
                  <li class="flex items-center gap-2">
                    <span class="text-slate-300">✓</span> <strong>5% off</strong> every treatment
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Arrow -->
          <div class="hidden sm:flex items-center text-stone-300 text-2xl px-1 self-center">›</div>
          <div class="sm:hidden text-center text-stone-300 text-2xl">↓</div>

          <!-- Gold -->
          <div class="flex-1 rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-500 to-amber-600 p-6 relative">
            <div class="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-white/20" />
            <div class="relative">
              <span class="text-xs font-bold uppercase tracking-widest bg-yellow-900/20 px-2 py-1 rounded-full text-yellow-900">Gold</span>
              <h3 class="font-display text-2xl mt-3 mb-1 text-yellow-900">12 stamps</h3>
              <p class="text-yellow-800/80 text-sm mb-5">Our top tier, rewarding your continued loyalty with exclusive extras.</p>
              <div class="flex gap-1.5 mb-5">
                <div v-for="i in 6" :key="i" class="h-8 w-8 rounded-full border-2 border-yellow-700/40 flex items-center justify-center text-sm">
                  🍒
                </div>
              </div>
              <div class="border-t border-yellow-700/30 pt-4 text-yellow-900">
                <p class="text-xs text-yellow-800/70 uppercase tracking-wide font-medium mb-2">Benefits</p>
                <ul class="space-y-1.5 text-sm">
                  <li class="flex items-center gap-2"><span>✓</span> <strong>10% off</strong> every treatment</li>
                  <li class="flex items-center gap-2"><span>✓</span> Loyalty goodie bag</li>
                  <li class="flex items-center gap-2"><span>✓</span> Birthday gift</li>
                  <li class="flex items-center gap-2"><span>✓</span> Priority bookings</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Summary table -->
    <section class="max-w-2xl mx-auto px-4 sm:px-6 py-14">
      <h2 class="font-display text-3xl text-center text-[#D4769E] mb-8">All benefits at a glance</h2>
      <div class="card overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-stone-50 border-b border-stone-200">
            <tr>
              <th class="text-left px-5 py-3 text-stone-600 font-medium">Benefit</th>
              <th class="text-center px-4 py-3 text-stone-600 font-medium">
                <span class="inline-flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-amber-600 inline-block"></span> Bronze</span>
              </th>
              <th class="text-center px-4 py-3 text-stone-600 font-medium">
                <span class="inline-flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-slate-500 inline-block"></span> Silver</span>
              </th>
              <th class="text-center px-4 py-3 text-stone-600 font-medium">
                <span class="inline-flex items-center gap-1"><span class="h-2 w-2 rounded-full bg-yellow-500 inline-block"></span> Gold</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100">
            <tr>
              <td class="px-5 py-3.5 text-stone-700">Stamps needed</td>
              <td class="px-4 py-3.5 text-center text-stone-500">0</td>
              <td class="px-4 py-3.5 text-center text-stone-500">6</td>
              <td class="px-4 py-3.5 text-center text-stone-500">12</td>
            </tr>
            <tr class="bg-stone-50/50">
              <td class="px-5 py-3.5 text-stone-700">5% off every treatment</td>
              <td class="px-4 py-3.5 text-center text-stone-300">—</td>
              <td class="px-4 py-3.5 text-center text-green-600">✓</td>
              <td class="px-4 py-3.5 text-center text-stone-300">—</td>
            </tr>
            <tr>
              <td class="px-5 py-3.5 text-stone-700">10% off every treatment</td>
              <td class="px-4 py-3.5 text-center text-stone-300">—</td>
              <td class="px-4 py-3.5 text-center text-stone-300">—</td>
              <td class="px-4 py-3.5 text-center text-green-600">✓</td>
            </tr>
            <tr>
              <td class="px-5 py-3.5 text-stone-700">Loyalty goodie bag</td>
              <td class="px-4 py-3.5 text-center text-stone-300">—</td>
              <td class="px-4 py-3.5 text-center text-stone-300">—</td>
              <td class="px-4 py-3.5 text-center text-green-600">✓</td>
            </tr>
            <tr class="bg-stone-50/50">
              <td class="px-5 py-3.5 text-stone-700">Birthday gift</td>
              <td class="px-4 py-3.5 text-center text-stone-300">—</td>
              <td class="px-4 py-3.5 text-center text-stone-300">—</td>
              <td class="px-4 py-3.5 text-center text-green-600">✓</td>
            </tr>
            <tr>
              <td class="px-5 py-3.5 text-stone-700">Priority bookings</td>
              <td class="px-4 py-3.5 text-center text-stone-300">—</td>
              <td class="px-4 py-3.5 text-center text-stone-300">—</td>
              <td class="px-4 py-3.5 text-center text-green-600">✓</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Live loyalty cards (logged in) -->
    <section v-if="authStore.isLoggedIn" class="bg-rose-50 py-12 px-4">
      <div class="max-w-3xl mx-auto">
        <h2 class="font-display text-3xl text-center text-[#D4769E] mb-8">Your loyalty cards</h2>
        <LoyaltyDashboard />
        <div class="text-center mt-8">
          <RouterLink to="/booking" class="btn-primary text-base px-6 py-3">Book your next appointment</RouterLink>
        </div>
      </div>
    </section>

    <!-- CTA for guests -->
    <section v-else class="bg-[#D4769E] py-14 px-4 text-center">
      <h2 class="font-display text-3xl text-white mb-3">Ready to start earning?</h2>
      <p class="text-white/80 mb-6 text-lg">Create a free account and every visit will count towards your rewards.</p>
      <div class="flex gap-3 justify-center flex-wrap">
        <RouterLink to="/register" class="inline-flex items-center gap-2 bg-white text-[#D4769E] font-semibold px-6 py-3 rounded-xl hover:bg-rose-50 transition-colors shadow-md">
          Create free account
        </RouterLink>
        <RouterLink to="/login" class="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-colors">
          Sign in
        </RouterLink>
      </div>
    </section>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LoyaltyDashboard from '@/components/loyalty/LoyaltyDashboard.vue'

const authStore = useAuthStore()
</script>
