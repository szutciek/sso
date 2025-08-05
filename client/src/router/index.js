import { createRouter, createWebHistory } from "vue-router";

import authRoutes from "./auth.js";
import userRoutes from "./user.js";
import appRoutes from "./app.js";
import developerRoutes from "./developer.js";

import NavigationComponent from "@/components/NavigationComponent.vue";
import NavigationComponentLite from "@/components/NavigationComponentLite.vue";
import FooterComponent from "@/components/FooterComponent.vue";

import Authorize from "@/views/auth/Authorize.vue";

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
    path: "/authorize",
    name: "authorizeCatch",
    components: {
      default: Authorize,
      navigation: NavigationComponentLite,
      // footer: FooterComponent,
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

  // Website authentication pages
  ...authRoutes.map((r) => {
    r.path = `/:locale${r.path}`;
    return r;
  }),

  // Website from the perspecive of a normal user
  ...userRoutes.map((r) => {
    r.path = `/:locale${r.path}`;
    return r;
  }),

  ,
  // Website from the perspective of a app admin
  ...appRoutes.map((r) => {
    r.path = `/:locale${r.path}`;
    return r;
  }),

  // Website from the perspective of a broader admin
  ...developerRoutes.map((r) => {
    r.path = `/:locale${r.path}`;
    return r;
  }),

  {
    path: "/:catchAll(.*)",
    name: "lost",
    components: {
      default: () => import("../views/Lost.vue"),
      navigation: NavigationComponentLite,
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

import lS from "@/store/localeStore.js";

router.beforeEach((to, from, next) => {
  const urlLocale = to.path.split("/")[1];
  if (!lS.supportedLocales.includes(urlLocale)) {
    next({ path: `/en${to.fullPath}`, query: to.query, replace: true });
  } else {
    next();
  }
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
