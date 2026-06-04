import { createRouter, createWebHistory } from "vue-router";
import { isAuthenticated } from "@/content/auth";

import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import AdminView from "@/views/AdminView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { layout: "default" }
  },
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
