<template>
  <div class="min-h-screen flex bg-gray-900 text-gray-200">
    <!-- Sidebar -->
    <aside
      class="flex-none flex flex-col bg-gray-950 border-r border-gray-800 py-6 px-2 transition-all duration-300"
      :class="collapsed ? 'w-14' : 'w-64'"
    >
      <!-- Logo & toggle -->
      <div class="flex items-center justify-between mb-10 px-2">
        <transition name="fade">
          <span
            v-if="!collapsed"
            key="logo"
            class="text-3xl font-semibold tracking-loose text-yellow-400"
          >
            Watch
          </span>
        </transition>

        <button
          class="text-gray-400 hover:text-white w-6 h-6 relative flex items-center justify-center"
          @click="collapsed = !collapsed"
        >
          <!-- Always render both icons to prevent size jump -->
          <ArrowLeftToLine
            v-show="!collapsed"
            class="absolute w-5 h-5 transition-transform duration-300"
          />
          <Menu
            v-show="collapsed"
            class="absolute w-5 h-5 transition-transform duration-300"
          />
        </button>
      </div>

      <!-- Menu -->
      <nav class="flex-1 space-y-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.name"
          :to="link.path"
          class="group relative flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-300"
          :class="{
            'bg-gray-800 text-white font-semibold': isActive(link.path),
          }"
        >
          <!-- Highlight bar -->
          <span
            v-if="isActive(link.path)"
            class="absolute left-0 top-0 h-full w-1 bg-yellow-400 rounded-r-md transition-all duration-300"
          ></span>

          <component
            :is="link.icon"
            class="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-white transition-colors duration-300"
          />
          <transition name="fade">
            <span v-if="!collapsed" key="text">{{ link.name }}</span>
          </transition>
        </RouterLink>
      </nav>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto transition-all duration-300 p-6">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import {
  Home,
  Users,
  BarChart3,
  Settings,
  ArrowLeftToLine,
  Menu,
} from "lucide-vue-next";

const route = useRoute();
const collapsed = ref(false);

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "Users", path: "/users", icon: Users },
  { name: "Stock", path: "/stock", icon: BarChart3 },
  { name: "Settings", path: "/settings", icon: Settings },
];

const isActive = (path: string) => route.path === path;
</script>

<style scoped>
/* Fade transition for text/logo */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
