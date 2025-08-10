import NavigationComponentLite from "@/components/NavigationComponentLite.vue";

export default [
  {
    path: `/trust/:_id`,
    components: {
      default: () => import("../views/app/TrustApp.vue"),
      navigation: NavigationComponentLite,
    },
  },
];
