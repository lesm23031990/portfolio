import { createRouter, createWebHistory } from "vue-router";

// Vistas
import HomeView from "@/views/HomeView.vue";

// (opcional) lazy loading
// const HomeView = () => import("@/views/HomeView.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },

  /*{
    path: "/about",
    name: "about",
    component: () => import("@/views/AboutView.vue"),
  },

  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/NotFoundView.vue"),
  },*/
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
