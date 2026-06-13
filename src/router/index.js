import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "@/content/auth";

import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import AdminView from "@/views/AdminView.vue";

const adminRoutes = process.env.NODE_ENV === 'development' ? [
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: { layout: "blank" }
  },
  {
    path: "/admin",
    name: "admin",
    component: AdminView,
    meta: { layout: "blank", requiresAuth: true }
  }
] : []

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { layout: "default" }
  },
  ...adminRoutes
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next({ name: "login", query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
