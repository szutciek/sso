import { createRouter, createWebHistory } from "vue-router";

import userRoutes from "./user.js";
import appRoutes from "./app.js";
import developerRoutes from "./developer.js";

import NavigationComponent from "@/components/NavigationComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

// BASE URL: /:locale

const routes = [
  {
    path: "/",
    redirect: "/en",
  },
  {
    path: "/:locale/home",
    redirect: (to) => {
      return { path: `/${to.params.locale}` };
    },
  },
  {
    path: "/:locale",
    name: "home",
    components: {
      default: () => import("../views/Home.vue"),
      navigation: NavigationComponent,
      footer: FooterComponent,
    },
  },

  // Website from the perspecive of a normal user
  ...userRoutes,
  // Website from the perspective of a app admin
  ...appRoutes,
  // Website from the perspective of a broader admin
  ...developerRoutes,

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
