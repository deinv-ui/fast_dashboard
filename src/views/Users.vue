<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-5 bg-white border-b border-gray-200 sticky top-0 z-10">
      <h1 class="text-2xl font-semibold text-gray-800 tracking-tight">👥 User Dashboard</h1>

      <div class="flex flex-wrap gap-2">
        <!-- Search Bar -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="border border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-white transition-all"
          />
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
          </svg>
        </div>

        <button @click="onSearch" :disabled="loading" class="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-60">
          {{ loading ? "Searching..." : "Search" }}
        </button>

        <button @click="reloadUsers" :disabled="loading" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-60">
          {{ totalUsers ? "Reload Users" : "Load Users" }}
        </button>

        <button @click="createRandomUser" :disabled="loading" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-60">
          Add Random User
        </button>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 px-6 py-6">
      <!-- Loading -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        <div v-for="i in 8" :key="i" class="h-56 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col items-center justify-center">
          <div class="w-20 h-20 bg-gray-200 rounded-full mb-3"></div>
          <div class="h-3 bg-gray-200 rounded w-24 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-32 mb-2"></div>
          <div class="h-3 bg-gray-200 rounded w-16"></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-red-500 text-center mt-10">{{ error }}</div>

      <!-- Users -->
      <div v-else-if="paginatedUsers.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all">
        <div v-for="user in paginatedUsers" :key="user.id" class="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all p-5 flex flex-col items-center text-center">
          <img :src="user.avatar" alt="User avatar" class="w-20 h-20 rounded-full mb-3 object-cover border" />
          <div class="font-semibold text-gray-800 text-lg">{{ user.firstName }} {{ user.lastName }}</div>
          <div class="text-gray-500 text-sm mt-1 truncate w-40">{{ user.email }}</div>
          <div class="text-gray-500 text-xs mt-2">{{ user.country }}</div>
          <span :class="['mt-3 text-xs font-medium px-3 py-1 rounded-full capitalize', user.gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700']">{{ user.gender }}</span>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="text-gray-500 text-center py-20 italic transition-all">No users found. Try searching or loading again.</div>
    </main>

    <!-- Pagination -->
    <footer v-if="totalPages > 1" class="flex justify-center items-center gap-2 py-4 mt-10 bg-transparent w-full bottom-0">
      <button @click="prevPage" :disabled="currentPage === 1 || loading" class="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-100 transition-all">Prev</button>
      <button v-for="page in visiblePageNumbers" :key="page" @click="goToPage(page)" :disabled="loading" :class="['px-3 py-1 border rounded text-sm transition-all', page === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-100']">{{ page }}</button>
      <button @click="nextPage" :disabled="currentPage === totalPages || loading" class="px-3 py-1 border rounded text-sm disabled:opacity-50 hover:bg-gray-100 transition-all">Next</button>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/userStore";

const userStore = useUserStore();
const {
  paginatedUsers,
  loading,
  error,
  currentPage,
  totalPages,
  visiblePageNumbers,
  totalUsers,
} = storeToRefs(userStore);

const { loadUsers, nextPage, prevPage, goToPage, searchUsers } = userStore;

const searchQuery = ref("");

onMounted(() => loadUsers());

const onSearch = async () => {
  if (!searchQuery.value.trim()) return;
  await searchUsers(searchQuery.value);
};

// Create random user and reload current page
const createRandomUser = async () => {
  try {
    await fetch("http://localhost:3000/api/users/random", { method: "POST" });
    await loadUsers(currentPage.value, userStore.pageSize);
  } catch (err) {
    console.error(err);
  }
};

// Reload users (current page)
const reloadUsers = async () => {
  await loadUsers(currentPage.value, userStore.pageSize);
};
</script>
