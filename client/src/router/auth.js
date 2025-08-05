import NavigationComponentLite from "@/components/NavigationComponentLite.vue";

import Authenticate from "@/views/authentication/Authenticate.vue";
import Authenticate2FA from "@/views/authentication/Authenticate2FA.vue";

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
  {
    path: `${base}/authenticate/2fa`,
    name: "Authenticate2FA",
    components: {
      default: Authenticate2FA,
      navigation: NavigationComponentLite,
      // footer: FooterComponent,
    },
  },
];
