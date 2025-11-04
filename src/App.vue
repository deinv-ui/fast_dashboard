<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">

          <!-- Logo (left) -->
          <div class="flex-shrink-0">
            <span class="text-xl font-bold text-gray-800">waTCH</span>
          </div>

          <!-- Desktop Menu (right) -->
          <div class="hidden md:flex space-x-8 ml-auto">
            <RouterLink
              v-for="link in navLinks"
              :key="link.name"
              :to="link.path"
              class="relative text-gray-700 font-medium transition-colors duration-200"
              :class="{ 'text-blue-600 font-semibold': isActive(link.path) }"
            >
              <span
                class="pb-1 relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300"
              >
                {{ link.name }}
              </span>
            </RouterLink>
          </div>

          <!-- Mobile Menu Button -->
          <div class="md:hidden flex items-center ml-auto">
            <button
              @click="open = !open"
              class="text-gray-700 hover:text-blue-600 focus:outline-none transition-colors duration-200"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition name="slide-fade">
        <div v-if="open" class="md:hidden bg-white shadow-lg rounded-b-md overflow-hidden text-right">
          <RouterLink
            v-for="link in navLinks"
            :key="link.name"
            :to="link.path"
            class="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition-colors duration-200 text-right"
            :class="{ 'bg-blue-100 text-blue-700 font-semibold': isActive(link.path) }"
          >
            {{ link.name }}
          </RouterLink>
        </div>
      </transition>
    </nav>

    <!-- Page Content -->
    <main class="flex-1 p-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const open = ref(false);
const route = useRoute();
const router = useRouter();

// Navbar links
const navLinks = [
  { name: 'Users', path: '/users' },
  { name: 'Stock', path: '/stock' },
];

// Highlight active link, default Stock if at root
const isActive = (path: string) => {
  if (route.path === '/') return path === '/stock';
  return route.path === path;
};

// Redirect '/' to '/stock' automatically
if (route.path === '/') {
  router.replace('/stock');
}
</script>

<style scoped>
/* Hover underline animation for desktop */
nav a span::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 0;
  background-color: #2563eb;
  transition: width 0.3s ease;
}
nav a span:hover::after { width: 100%; }

/* Mobile menu transition */
.slide-fade-enter-active { transition: all 0.3s ease; }
.slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from { opacity:0; transform:translateY(-10px); }
.slide-fade-enter-to { opacity:1; transform:translateY(0); }
.slide-fade-leave-from { opacity:1; transform:translateY(0); }
.slide-fade-leave-to { opacity:0; transform:translateY(-10px); }
</style>
