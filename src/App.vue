<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation -->
    <nav class="bg-gray-100 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <!-- Logo -->
          <div class="flex-shrink-0">
            <img src="/src/assets/logo.png" alt="Logo" class="h-16 w-16 logo" />
          </div>

          <!-- Desktop Menu -->
          <div class="hidden md:flex space-x-6">
            <RouterLink
              v-for="link in navLinks"
              :key="link.name"
              :to="link.path"
              class="relative text-gray-700 font-medium transition-colors"
              :class="{
                'text-blue-600': isActive(link.path),
              }"
            >
              <span
                class="hover:after:w-full after:content-[''] after:block after:h-0.5 after:bg-blue-600 after:w-0 after:absolute after:left-0 after:bottom-0 after:transition-all"
              >
                {{ link.name }}
              </span>
            </RouterLink>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden flex items-center">
            <button
              @click="open = !open"
              class="text-gray-700 focus:outline-none"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="open" class="md:hidden bg-white shadow-lg">
        <RouterLink
          v-for="link in navLinks"
          :key="link.name"
          :to="link.path"
          class="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
          :class="{ 'bg-blue-100 text-blue-700': isActive(link.path) }"
        >
          {{ link.name }}
        </RouterLink>
      </div>
    </nav>

    <!-- Page Content -->
    <main class="flex-1 p-6 bg-gray-50">
      <RouterView />
    </main>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const open = ref(false); // mobile menu state
const route = useRoute();

// Navigation links
const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/About" },
  { name: "Users", path: "/Users" },
  { name: "Stock", path: "/Stock" },
];

// Determine if a link is active
const isActive = (path: string) => route.path === path;
</script>
<style scoped>
.logo {
  height: 2.5rem;
  transition: transform 0.3s, filter 0.3s;
}

/* Desktop menu underline animation */
nav a span {
  position: relative;
  display: inline-block;
  padding-bottom: 2px;
}

nav a span::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 0;
  background-color: #2563eb; /* blue-600 */
  transition: width 0.3s;
}

nav a span:hover::after {
  width: 100%;
}
</style>
