// stores/themeStore.ts
import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const darkMode = ref(false);

  // Persist in localStorage so it survives refresh
  if (localStorage.getItem("darkMode")) {
    darkMode.value = localStorage.getItem("darkMode") === "true";
  }

  watch(darkMode, (val) => {
    localStorage.setItem("darkMode", String(val));
    document.documentElement.classList.toggle("dark", val);
  }, { immediate: true });

  const toggleTheme = () => {
    darkMode.value = !darkMode.value;
  };

  return { darkMode, toggleTheme };
});
