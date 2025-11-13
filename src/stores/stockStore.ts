// src/stores/stockStore.ts
import { defineStore } from "pinia";
import { fetchStockQuote, type StockQuote } from "../data/stockApi";

const DEFAULT_SYMBOLS = ["AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "FB", "NVDA", "NFLX", "BABA", "DIS"];

export const useStockStore = defineStore("stock", {
  state: () => ({
    allStocks: [] as StockQuote[],
    paginatedStocks: [] as StockQuote[],
    watchlist: [] as StockQuote[],
    loading: false,
    error: null as string | null,
    currentPage: 1,
    pageSize: 6,
    refreshInterval: 15000,
    refreshTimer: null as any,
  }),
  getters: {
    totalStockPages: (state) => Math.ceil(state.allStocks.length / state.pageSize),
  },
  actions: {
    async loadDefaultStocks() {
      this.loading = true;
      this.error = null;
      try {
        const quotes = await Promise.all(DEFAULT_SYMBOLS.map(symbol => fetchStockQuote(symbol)));
        this.allStocks = quotes;
        this.currentPage = 1;
        this.updatePagination();
      } catch (err) {
        this.error = "Failed to load default stocks";
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    async searchAndLoad(symbol: string) {
      if (!symbol.trim()) return;
      this.loading = true;
      this.error = null;
      try {
        const quote = await fetchStockQuote(symbol.toUpperCase());
        const index = this.allStocks.findIndex(s => s.symbol === quote.symbol);
        if (index > -1) this.allStocks[index] = quote;
        else this.allStocks.unshift(quote);

        if (!this.watchlist.find(s => s.symbol === quote.symbol)) {
          this.watchlist.unshift(quote);
        }

        this.currentPage = 1;
        this.updatePagination();
      } catch (err) {
        this.error = `Failed to load stock ${symbol.toUpperCase()}`;
        console.error(err);
      } finally {
        this.loading = false;
      }
    },

    updatePagination() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.paginatedStocks = this.allStocks.slice(start, end);
    },

    nextPage() {
      if (this.currentPage < this.totalStockPages) {
        this.currentPage++;
        this.updatePagination();
      }
    },

    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.updatePagination();
      }
    },

    goToPage(page: number) {
      if (page >= 1 && page <= this.totalStockPages) {
        this.currentPage = page;
        this.updatePagination();
      }
    },

    reloadStocks() {
      this.loadDefaultStocks();
    },

    // =====================
    // Watchlist auto-refresh
    // =====================
    async refreshWatchlist() {
      if (!this.watchlist.length) return;

      try {
        const updatedQuotes = await Promise.all(
          this.watchlist.map(stock => fetchStockQuote(stock.symbol))
        );

        updatedQuotes.forEach((quote) => {
          const index = this.watchlist.findIndex(s => s.symbol === quote.symbol);
          if (index > -1) this.watchlist[index] = quote;

          const allIndex = this.allStocks.findIndex(s => s.symbol === quote.symbol);
          if (allIndex > -1) this.allStocks[allIndex] = quote;
        });

        this.updatePagination();
      } catch (err) {
        console.error("Failed to refresh watchlist", err);
      }
    },

    // =====================
    // New method: refresh all stocks for homepage
    // =====================
    async refreshStocks() {
      if (!this.allStocks.length) return;
      try {
        const updatedQuotes = await Promise.all(
          this.allStocks.map(stock => fetchStockQuote(stock.symbol))
        );
        this.allStocks = updatedQuotes;
        this.updatePagination();
      } catch (err) {
        console.error("Failed to refresh stocks", err);
      }
    },

    startAutoRefresh() {
      if (this.refreshTimer) clearInterval(this.refreshTimer);
      this.refreshTimer = setInterval(() => this.refreshWatchlist(), this.refreshInterval);
    },

    stopAutoRefresh() {
      if (this.refreshTimer) clearInterval(this.refreshTimer);
      this.refreshTimer = null;
    },
  },
});
