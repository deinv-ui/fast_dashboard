<template>
  <div class="p-6 flex flex-col min-h-screen relative bg-gray-50">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
    >
      <h1 class="text-3xl font-bold text-gray-800">Stock Dashboard</h1>

      <div class="flex flex-wrap gap-2 w-full sm:w-auto">
        <input
          v-model="symbolInput"
          type="text"
          placeholder="Search stock symbol..."
          class="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-60"
        />
        <button
          @click="onSearch"
          class="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-all w-full sm:w-auto"
        >
          Search
        </button>
        <button
          @click="reloadStocks"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all w-full sm:w-auto"
        >
          Reload
        </button>
      </div>
    </div>

    <!-- Watchlist -->
    <div v-if="watchlistStocks.length" class="mb-8">
      <h2 class="text-xl font-semibold mb-4 text-gray-700">Watchlist</h2>
      <div class="flex gap-4 overflow-x-auto pb-2">
        <div
          v-for="stock in watchlistStocks"
          :key="stock.symbol"
          class="bg-white border border-gray-200 rounded-2xl shadow-md p-4 flex flex-col items-center text-center min-w-[160px] flex-shrink-0 hover:shadow-xl transition-shadow duration-300"
        >
          <div class="font-bold text-lg">{{ stock.symbol }}</div>
          <div
            :class="
              stock.price >= stock.previousClose
                ? 'text-green-600'
                : 'text-red-600'
            "
            class="text-2xl font-semibold mt-1"
          >
            {{ stock.price.toFixed(2) }}
          </div>
          <div class="w-full h-16 mt-2">
            <canvas
              :id="'watchlist-' + stock.symbol"
              class="w-full h-full"
            ></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- Loader -->
    <div
      v-if="loading"
      class="absolute inset-0 bg-white/70 flex items-center justify-center z-10 text-gray-600 text-lg font-medium"
    >
      Loading stocks...
    </div>

    <!-- Error -->
    <div
      v-if="error && !loading"
      class="text-red-500 text-center mt-10 text-lg font-medium"
    >
      {{ error }}
    </div>

    <!-- Stock Grid -->
    <div
      v-if="paginatedStocks.length && !loading"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="stock in paginatedStocks"
        :key="stock.symbol"
        class="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-5 flex flex-col items-center text-center"
      >
        <div class="flex items-center justify-between w-full mb-2">
          <span class="text-lg font-bold text-gray-800">{{
            stock.symbol
          }}</span>
          <span
            :class="
              stock.price >= stock.previousClose
                ? 'text-green-600'
                : 'text-red-600'
            "
            class="font-semibold text-lg"
          >
            {{ stock.price.toFixed(2) }}
          </span>
        </div>

        <div class="text-sm text-gray-500 w-full mb-1 flex justify-between">
          <span>O: {{ stock.open.toFixed(2) }}</span>
          <span>H: {{ stock.high.toFixed(2) }}</span>
          <span>L: {{ stock.low.toFixed(2) }}</span>
        </div>
        <div class="text-xs text-gray-400 w-full mb-2 text-left">
          Prev Close: {{ stock.previousClose.toFixed(2) }}
        </div>

        <!-- Chart -->
        <div class="w-full h-32 mb-3">
          <canvas :id="'chart-' + stock.symbol" class="w-full h-full"></canvas>
        </div>

        <!-- Watchlist toggle -->
        <button
          @click="toggleWatchlist(stock.symbol)"
          class="px-3 py-1 text-sm rounded-full border border-gray-300 hover:bg-gray-100 transition-colors duration-200"
        >
          {{ watchlist.has(stock.symbol) ? "Remove" : "Add" }}
        </button>
      </div>
    </div>

    <div
      v-else-if="!loading && !error"
      class="text-gray-500 text-center py-20 italic text-lg"
    >
      No stocks loaded yet.
    </div>

    <!-- Pagination -->
    <div
      v-if="totalStockPages > 1"
      class="flex justify-center items-center gap-2 py-6"
    >
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
      >
        Prev
      </button>

      <button
        v-for="page in totalStockPages"
        :key="page"
        @click="goToPage(page)"
        :class="[
          'px-3 py-1 border rounded',
          page === currentPage
            ? 'bg-blue-600 text-white border-blue-600'
            : 'hover:bg-gray-100',
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="nextPage"
        :disabled="currentPage === totalStockPages"
        class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { storeToRefs } from "pinia";
import { useStockStore } from "../stores/stockStore";
import Chart from "chart.js/auto";
import type { StockQuote } from "../data/stockApi";
import { useThemeStore } from "../stores/themeStore";
const themeStore = useThemeStore();

const stockStore = useStockStore();
const { paginatedStocks, loading, error, currentPage, totalStockPages } =
  storeToRefs(stockStore);
const {
  nextPage,
  prevPage,
  goToPage,
  reloadStocks,
  searchAndLoad,
  refreshWatchlist,
} = stockStore;

const symbolInput = ref("");
const watchlist = ref(new Set<string>());
const chartInstances = new Map<string, Chart>();

const watchlistStocks = ref<StockQuote[]>([]);
watch([() => Array.from(watchlist.value), paginatedStocks], () => {
  watchlistStocks.value = paginatedStocks.value.filter((s) =>
    watchlist.value.has(s.symbol)
  );
  nextTick().then(renderWatchlistCharts);
});

const onSearch = async () => {
  if (!symbolInput.value.trim()) return;
  await searchAndLoad(symbolInput.value);
};

const toggleWatchlist = (symbol: string) => {
  if (watchlist.value.has(symbol)) watchlist.value.delete(symbol);
  else watchlist.value.add(symbol);
};

onMounted(() => {
  reloadStocks();
  startAutoRefresh();
});

watch(paginatedStocks, async (stocks) => {
  await nextTick();
  stocks.forEach((stock) => renderChart("chart-" + stock.symbol, stock));
});

const renderChart = (canvasId: string, stock: any, small = false) => {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return;

  canvas.height = small ? 60 : 120;

  if (chartInstances.has(canvasId)) chartInstances.get(canvasId)!.destroy();

  chartInstances.set(
    canvasId,
    new Chart(canvas, {
      type: "line",
      data: {
        labels: ["Open", "High", "Low", "Prev Close", "Price"],
        datasets: [
          {
            label: stock.symbol,
            data: [
              stock.open,
              stock.high,
              stock.low,
              stock.previousClose,
              stock.price,
            ],
            borderColor: small ? "rgb(16, 185, 129)" : "rgb(37, 99, 235)",
            fill: false,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: false,
            ticks: { color: themeStore.darkMode ? "#e5e7eb" : "#374151" },
          },
          x: { ticks: { color: themeStore.darkMode ? "#e5e7eb" : "#374151" } },
        },
      },
    })
  );
};

const renderWatchlistCharts = () => {
  watchlistStocks.value.forEach((stock) =>
    renderChart("watchlist-" + stock.symbol, stock, true)
  );
};

const startAutoRefresh = () => {
  setInterval(async () => {
    if (watchlist.value.size === 0) return;
    await refreshWatchlist();
  }, 30000);
};
</script>
