import NavigationComponent from "@/components/NavigationComponent.vue";
import NavigationComponentLite from "@/components/NavigationComponentLite.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default [
  {
    path: `/trust/:_id`,
    components: {
      default: () => import("../views/app/TrustApp.vue"),
      navigation: NavigationComponentLite,
    },
  },
  {
    path: `/apps`,
    components: {
      //   default: () => import("../views/app/AppDashboard.vue"),
      navigation: NavigationComponent,
      footer: FooterComponent,
    },
  },
  {
    path: `/apps/create`,
    components: {
      //   default: () => import("../views/app/CreateApp.vue"),
      navigation: NavigationComponent,
      footer: FooterComponent,
    },
  },
  {
    path: `/apps/:_id`,
    components: {
      //   default: () => import("../views/app/PreviewApp.vue"),
      navigation: NavigationComponent,
      footer: FooterComponent,
    },
  },
];
