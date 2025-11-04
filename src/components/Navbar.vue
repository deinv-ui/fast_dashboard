<template>
<nav class="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16 items-center">
      <div class="flex-shrink-0 flex items-center">
        <span class="ml-2 font-bold text-xl text-black dark:text-white">waTCH</span>
      </div>
      <!-- Desktop -->
      <div class="hidden md:flex space-x-8 items-center">
        <RouterLink
          v-for="link in navLinks"
          :key="link.name"
          :to="link.path"
          :class="{
            'text-blue-600 dark:text-blue-400 font-semibold': isActive(link.path),
            'text-gray-700 dark:text-gray-300': !isActive(link.path)
          }"
        >
          {{ link.name }}
        </RouterLink>

      
      </div>

      <!-- Mobile -->
      <div class="md:hidden flex items-center">
        <button @click="open=!open" class="text-gray-700 dark:text-gray-300 focus:outline-none">
          ☰
        </button>
      </div>
    </div>
  </div>

  <transition name="slide-fade">
    <div v-if="open" class="md:hidden bg-white dark:bg-gray-900 shadow-lg rounded-b-md overflow-hidden">
      <RouterLink
        v-for="link in navLinks"
        :key="link.name"
        :to="link.path"
        class="block px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-800 hover:text-blue-600 dark:hover:text-blue-400 font-medium"
      >
        {{ link.name }}
      </RouterLink>
    </div>
  </transition>
</nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Users', path: '/users' },
  { name: 'Stock', path: '/stock' },
];
const open = ref(false);
const route = useRoute();
const isActive = (path:string) => route.path.toLowerCase() === path.toLowerCase();
</script>
