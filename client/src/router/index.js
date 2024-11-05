import { createRouter, createWebHistory } from "vue-router";

import userRoutes from "./user.js";
import appRoutes from "./app.js";
import adminRoutes from "./admin.js";

const routes = [
  {
    path: "/",
    redirect: "/en",
  },

  // Website from the perspecive of a normal user
  ...userRoutes,
  // Website from the perspective of a app admin
  ...appRoutes,
  // Website from the perspective of a broader admin
  ...adminRoutes,

  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;

// METHODS: ------------------------------------------------------

// {
//   path: "/updates",
//   name: "updates",
//   components: {
//     default: () => import("../views/UpdatesView.vue"),
//     navigation: NavigationComponent,
//     footer: FooterComponent,
//   },
// },
