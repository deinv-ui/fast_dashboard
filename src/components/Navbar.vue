<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">

        <!-- Logo -->
        <div class="flex-shrink-0">
          <span class="text-xl font-bold text-gray-800">waTCH</span>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex space-x-8 ml-auto">
          <RouterLink
            v-for="link in navLinks"
            :key="link.name"
            :to="link.path"
            class="relative text-gray-700 font-medium transition-colors duration-200"
            :class="{ 'text-blue-600': isActive(link.path) }"
          >
            <span
              class="pb-1 relative after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-blue-600 after:transition-all after:duration-300"
              :class="{ 'after:w-full': isActive(link.path) }"
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
          @click="open = false"
          :class="{ 'text-blue-600 font-semibold': isActive(link.path) }"
        >
          {{ link.name }}
        </RouterLink>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";

const open = ref(false);
const route = useRoute();

const navLinks = [
  { name: "Home", path: "/home" },
  { name: "Users", path: "/users" },
  { name: "Stock", path: "/stock" },
];

const isActive = (path: string) => route.path === path;
</script>

<style scoped>
/* Desktop link underline animation */
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
nav a span:hover::after {
  width: 100%;
}

/* Active link underline stays visible */
nav a span.after-w-full {
  width: 100% !important;
}

/* Mobile menu transition */
.slide-fade-enter-active { transition: all 0.3s ease; }
.slide-fade-leave-active { transition: all 0.2s ease; }
.slide-fade-enter-from { opacity:0; transform:translateY(-10px); }
.slide-fade-enter-to { opacity:1; transform:translateY(0); }
.slide-fade-leave-from { opacity:1; transform:translateY(0); }
.slide-fade-leave-to { opacity:0; transform:translateY(-10px); }
</style>
