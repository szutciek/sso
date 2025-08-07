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
    path: "/authorize",
    name: "authorizeCatch",
    components: {
      default: Authorize,
      navigation: NavigationComponentLite,
      // footer: FooterComponent,
    },
  },

  ...authRoutes.map((r) => {
    r.path = `/:locale${r.path}`;
    return r;
  }),

  ...userRoutes.map((r) => {
    r.path = `/:locale${r.path}`;
    return r;
  }),

  ...appRoutes.map((r) => {
    r.path = `/:locale${r.path}`;
    return r;
  }),

  ...developerRoutes.map((r) => {
    r.path = `/:locale${r.path}`;
    return r;
  }),

  {
    path: "/:locale/home",
    components: {
      default: () => import("../views/Home.vue"),
      navigation: NavigationComponent,
      footer: FooterComponent,
    },
  },

  {
    path: "/",
    name: "redirection",
    redirect: (to) => {
      const locale = lS.locale;
      const profileList = window.localStorage.getItem("profileState");
      if (!profileList) return { path: `/${locale}/home` };
      const profileListEmpty = profileList.includes(`"profiles":[]`);
      if (!profileListEmpty) {
        return { path: `/${locale}/user/panel` };
      }
      return { path: `/${locale}/home` };
    },
  },

  {
    path: "/:locale",
    name: "homeLocale",
    components: {
      default: () => import("../views/Home.vue"),
      navigation: NavigationComponent,
      footer: FooterComponent,
    },
  },

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
