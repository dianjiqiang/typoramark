import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/login",
    component: () => import("@/views/Login/Login.vue"),
  },
  {
    path: "/home",
    component: () => import("@/views/Home/Home.vue"),
  },
  {
    path: "/register",
    component: () => import("@/views/Register/Register.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
