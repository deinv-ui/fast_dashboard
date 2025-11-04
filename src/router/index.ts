import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Users from "../views/Users.vue";
import Stock from "../views/StockDashboard.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/About",
    name: "About",
    component: About,
  },
  {
    path: "/Users",
    name: "Users",
    component: Users,
  },
  {
    path: "/Stock",
    name: "Stock",
    component: Stock,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
