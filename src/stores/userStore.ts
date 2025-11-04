import { defineStore } from "pinia";
import { fetchUsers, type User } from "../data/mockUsers";

export const useUserStore = defineStore("user", {
  state: () => ({
    allUsers: [] as User[],
    filteredUsers: [] as User[],
    paginatedUsers: [] as User[],
    loading: false,
    error: null as string | null,
    currentPage: 1,
    pageSize: 8,
    searchQuery: "",
    totalPages: 0,
  }),
  getters: {
    totalPages: (state) =>
      Math.ceil(state.filteredUsers.length / state.pageSize) || 1,
    visiblePageNumbers: (state) => {
      const range = 3;
      const start = Math.max(1, state.currentPage - range);
      const end = Math.min(state.totalPages, state.currentPage + range);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },
  },
  actions: {
    async loadUsers() {
      this.loading = true;
      this.error = null;

      try {
        const data = await fetchUsers();
        this.allUsers = data;
        this.filteredUsers = data;
        this.paginate();
      } catch (err) {
        this.error = "Failed to load users";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    paginate() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.paginatedUsers = this.filteredUsers.slice(start, end);
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.paginate();
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.paginate();
      }
    },
    goToPage(page: number) {
      this.currentPage = page;
      this.paginate();
    },
    async searchUsers(query: string) {
      this.loading = true; 
      this.error = null;

      // Simulate API delay (500ms)
      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        const q = query.trim().toLowerCase();
        if (!q) {
          this.filteredUsers = this.allUsers;
        } else {
          this.filteredUsers = this.allUsers.filter((user) => {
            const name = `${user.name.first} ${user.name.last}`.toLowerCase();
            const email = user.email.toLowerCase();
            return name.includes(q) || email.includes(q);
          });
        }

        this.currentPage = 1;
        this.paginate();
      } catch (err) {
        this.error = "Search failed.";
      } finally {
        this.loading = false;
      }
    },
  },
});
