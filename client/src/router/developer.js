import NavigationComponent from "@/components/NavigationComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default [
  {
    path: `/developers`,
    components: {
      default: () => import("../views/developer/DeveloperPanel.vue"),
      navigation: () =>
        import("../components/developer/NavigationComponent.vue"),
      footer: FooterComponent,
    },
  },
  {
    path: `/developers/open`,
    components: {
      //   default: () => import("../views/developer/DeveloperPanel.vue"),
      navigation: NavigationComponent,
      footer: FooterComponent,
    },
  },
  {
    path: `/developers/close`,
    components: {
      //   default: () => import("../views/developer/DeveloperPanel.vue"),
      navigation: NavigationComponent,
      footer: FooterComponent,
    },
  },
];
