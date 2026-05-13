<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-10">
    <div class="mb-8">
      <h1 class="font-display text-4xl text-[#D4769E]">Memberships</h1>
      <p class="text-stone-500 mt-1">Assign and manage customer membership tiers</p>
    </div>

    <div v-if="store.loading" class="flex justify-center py-20"><AppSpinner size="lg" /></div>

    <div v-else-if="store.users.length === 0" class="card p-12 text-center text-stone-400">
      No customers found.
    </div>

    <div v-else class="card overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-stone-200 bg-stone-50">
            <th class="text-left px-5 py-3 font-medium text-stone-600">Name</th>
            <th class="text-left px-5 py-3 font-medium text-stone-600">Email</th>
            <th class="text-left px-5 py-3 font-medium text-stone-600">Current tier</th>
            <th class="text-left px-5 py-3 font-medium text-stone-600">Assign tier</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100">
          <tr v-for="user in customers" :key="user.uid" class="hover:bg-stone-50 transition-colors">
            <td class="px-5 py-3 font-medium text-stone-900">{{ user.name }}</td>
            <td class="px-5 py-3 text-stone-500">{{ user.email }}</td>
            <td class="px-5 py-3">
              <span v-if="user.membershipTier" :class="`badge-tier-${user.membershipTier}`">
                {{ TIER_LABELS[user.membershipTier] }}
              </span>
              <span v-else class="text-stone-400 text-xs">None</span>
            </td>
            <td class="px-5 py-3">
              <select
                :value="user.membershipTier || ''"
                @change="handleTierChange(user.uid, $event.target.value)"
                class="input py-1 text-sm w-40"
                :disabled="saving === user.uid"
              >
                <option value="">No membership</option>
                <option value="queen">Club Queen — £5/mo</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMembershipsStore } from '@/stores/memberships'
import AppSpinner from '@/components/ui/AppSpinner.vue'

const TIER_LABELS = { queen: 'Club Queen' }

const store = useMembershipsStore()
const saving = ref(null)

const customers = computed(() =>
  store.users.filter(u => u.role !== 'admin').sort((a, b) => a.name?.localeCompare(b.name))
)

onMounted(() => store.fetchAllUsers())

async function handleTierChange(uid, tier) {
  saving.value = uid
  try {
    await store.setMembershipTier(uid, tier || null)
  } finally {
    saving.value = null
  }
}
</script>
