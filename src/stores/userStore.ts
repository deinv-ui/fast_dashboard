// stores/userStore.ts
import { defineStore } from "pinia";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender?: string;
  country?: string;
  avatar?: string;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    paginatedUsers: [] as User[],    // Users for current page
    loading: false,
    error: null as string | null,
    currentPage: 1,
    pageSize: 8,
    searchQuery: "",
    totalPages: 1,
    totalUsers: 0,                   // Total users in backend
  }),
  getters: {
    visiblePageNumbers: (state) => {
      const range = 3;
      const start = Math.max(1, state.currentPage - range);
      const end = Math.min(state.totalPages, state.currentPage + range);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },
  },
  actions: {
    async loadUsers(page: number = 1, limit: number = 8, search: string = "") {
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch(
          `http://localhost:3000/api/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
        );
        const json = await res.json();

        this.paginatedUsers = json.data;
        this.currentPage = json.meta.page;
        this.totalPages = json.meta.lastPage;
        this.totalUsers = json.meta.total;
      } catch (err) {
        console.error(err);
        this.error = "Failed to load users from server";
      } finally {
        this.loading = false;
      }
    },

    async nextPage() {
      if (this.currentPage < this.totalPages) {
        await this.loadUsers(this.currentPage + 1, this.pageSize, this.searchQuery);
      }
    },

    async prevPage() {
      if (this.currentPage > 1) {
        await this.loadUsers(this.currentPage - 1, this.pageSize, this.searchQuery);
      }
    },

    async goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages) {
        await this.loadUsers(page, this.pageSize, this.searchQuery);
      }
    },

    async searchUsers(query: string) {
      this.searchQuery = query.trim();
      await this.loadUsers(1, this.pageSize, this.searchQuery);
    },
  },
});
