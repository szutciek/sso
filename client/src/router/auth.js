import NavigationComponentLite from "@/components/NavigationComponentLite.vue";

import Authenticate from "@/views/authentication/Authenticate.vue";

const base = "/:locale";

export default [
  {
    path: `${base}/authenticate`,
    name: "Authenticate",
    components: {
      default: Authenticate,
      navigation: NavigationComponentLite,
      // footer: FooterComponent,
    },
  },
];
