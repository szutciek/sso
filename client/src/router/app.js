import NavigationComponent from "@/components/NavigationComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default [
  {
    path: `apps`,
    components: {
      //   default: () => import("../views/app/AppDashboard.vue"),
      navigation: NavigationComponent,
      footer: FooterComponent,
    },
    children: [
      {
        path: `create`,
        components: {
          //   default: () => import("../views/app/CreateApp.vue"),
          navigation: NavigationComponent,
          footer: FooterComponent,
        },
      },
      {
        path: `:_id`,
        components: {
          //   default: () => import("../views/app/PreviewApp.vue"),
          navigation: NavigationComponent,
          footer: FooterComponent,
        },
      },
    ],
  },
];
