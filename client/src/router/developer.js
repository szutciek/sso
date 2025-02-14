import NavigationComponent from "@/components/NavigationComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

const base = "/:locale/developers";

export default [
  {
    path: `${base}`,
    components: {
      default: () => import("../views/developer/DeveloperPanel.vue"),
      navigation: () =>
        import("../components/developer/NavigationComponent.vue"),
      footer: FooterComponent,
    },
  },
  //   {
  //     path: `${base}/signup`,
  //     components: {
  //     //   default: () => import("../views/developer/DeveloperPanel.vue"),
  //       navigation: NavigationComponent,
  //       footer: FooterComponent,
  //     },
  //   },
];
