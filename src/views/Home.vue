<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header -->
    <header
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 bg-white border-b border-gray-200 sticky top-0 z-10"
    >
      <h1 class="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-2">
       Home Overview
      </h1>

      <button
        @click="refreshAll"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-200"
      >
        Refresh Data
      </button>
    </header>

    <!-- Content -->
    <main class="flex-1 px-6 py-6 space-y-10">

      <!-- Users Summary -->
      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Active Users</h2>
          <RouterLink
            to="/users"
            class="text-sm text-blue-500 hover:underline"
          >
            View All
          </RouterLink>
        </div>

        <!-- Loading Skeleton -->
        <div v-if="userLoading" class="flex gap-3 overflow-x-auto animate-pulse py-2">
          <div
            v-for="i in 5"
            :key="i"
            class="min-w-[140px] h-44 bg-gray-200 rounded-xl"
          ></div>
        </div>

        <!-- Users List -->
        <div v-else class="flex gap-4 overflow-x-auto py-2">
          <div
            v-for="user in recentUsers"
            :key="user.login?.uuid || user.id"
            class="min-w-[140px] bg-white border border-gray-200 rounded-xl shadow hover:shadow-lg transition-all p-4 flex flex-col items-center text-center"
          >
            <img
              :src="user.picture?.thumbnail || user.avatar"
              alt="avatar"
              class="w-14 h-14 rounded-full mb-3 object-cover border-2 border-gray-100"
            />
            <p class="font-semibold text-gray-800 text-sm truncate w-32">
              {{ user.name?.first || user.name }} {{ user.name?.last }}
            </p>
            <p class="text-xs text-gray-500 truncate w-32">
              {{ user.email }}
            </p>
          </div>
        </div>
      </section>

      <!-- Stock Summary -->
      <section>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-800">Market Snapshot</h2>
          <RouterLink
            to="/stocks"
            class="text-sm text-blue-500 hover:underline"
          >
            View All
          </RouterLink>
        </div>

        <!-- Stock Ticker -->
        <div class="bg-gray-900 text-white rounded-xl p-3 mb-4 overflow-hidden relative">
          <div class="flex gap-6 whitespace-nowrap animate-scroll">
            <div
              v-for="stock in stockStore.stocks"
              :key="stock.symbol"
              class="flex items-center gap-2 px-2 py-1 bg-gray-800 rounded-md"
            >
              <span class="font-medium">{{ stock.symbol }}</span>
              <span :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'">
                ${{ stock.price.toFixed(2) }}
              </span>
              <span :class="stock.change >= 0 ? 'text-green-400' : 'text-red-400'">
                ({{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%)
              </span>
            </div>
          </div>
        </div>

        <!-- Stock Cards -->
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="stock in stockStore.topStocks"
            :key="stock.symbol"
            class="bg-white dark:bg-gray-800 rounded-xl border shadow hover:shadow-lg transition-all p-4 flex justify-between items-center"
          >
            <div>
              <p class="font-semibold text-gray-800 dark:text-white">{{ stock.symbol }}</p>
              <p
                :class="stock.change >= 0 ? 'text-green-500' : 'text-red-500'"
                class="text-sm mt-1"
              >
                ${{ stock.price.toFixed(2) }}
                ({{ stock.change >= 0 ? '+' : '' }}{{ stock.change.toFixed(2) }}%)
              </p>
            </div>
            <div class="text-xs text-gray-400">
              {{ stock.change >= 0 ? '▲' : '▼' }}
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useUserStore } from "../stores/userStore";
import { useStockStore } from "../stores/stockStore";

const userStore = useUserStore();
const stockStore = useStockStore();

const userLoading = computed(() => userStore.loading);
const recentUsers = computed(() => (userStore.paginatedUsers || []).slice(0, 5));

const refreshAll = () => {
  userStore.loadUsers();
  stockStore.refreshStocks();
};

onMounted(() => {
  if (!userStore.paginatedUsers.length) userStore.loadUsers();
});

</script>

<style scoped>
/* Ticker animation */
.ticker {
  animation: scroll 25s linear infinite;
}
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
