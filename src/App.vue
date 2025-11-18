<template>
  <div class="min-h-screen flex bg-gray-900 text-gray-200">
    <!-- Sidebar -->
    <aside
      class="flex-none flex flex-col bg-gray-950 border-r border-gray-800 py-6 px-2 transition-all duration-300"
      :class="collapsed ? 'w-14' : 'w-64'"
    >
      <!-- Logo & toggle -->
      <div class="flex items-center justify-between mb-10 px-2">
        <span
          v-if="!collapsed"
          class="text-3xl font-semibold tracking-loose text-yellow-400"
        >
          Watch
        </span>
        <button
          class="text-gray-400 hover:text-white transition"
          @click="collapsed = !collapsed"
        >
          <component
            :is="collapsed ? Menu : ArrowLeftToLine"
            class="w-5 h-5"
          />
        </button>
      </div>

      <!-- Menu -->
      <nav class="flex-1 space-y-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.name"
          :to="link.path"
          class="flex items-center gap-3 px-3 py-3 rounded-lg transition hover:bg-gray-800 hover:text-white"
          :class="{
            'bg-gray-800 text-white font-semibold': isActive(link.path),
          }"
        >
          <component :is="link.icon" class="w-5 h-5" />
          <span v-if="!collapsed">{{ link.name }}</span>
        </RouterLink>
      </nav>

      <!-- Bottom -->
      <div class="mt-auto pt-6 border-t border-gray-800">
        <RouterLink
          to="/settings"
          class="flex items-center gap-3 px-3 py-3 rounded-lg transition hover:bg-gray-800"
        >
          <Settings class="w-5 h-5" />
          <span v-if="!collapsed">Settings</span>
        </RouterLink>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto transition-all duration-300">
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
];

const isActive = (path: string) => route.path === path;
</script>

<style scoped>
a {
  transition: background 0.25s ease, color 0.25s ease;
}
</style>
