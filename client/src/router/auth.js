import NavigationComponentLite from "@/components/NavigationComponentLite.vue";

import Authorize from "@/views/auth/Authorize.vue";
import Authenticate from "@/views/auth/Authenticate.vue";
import Authenticate2FA from "@/views/auth/Authenticate2FA.vue";

export default [
  {
    path: `/authorize`,
    name: "Authorize",
    components: {
      default: Authorize,
      navigation: NavigationComponentLite,
      // footer: FooterComponent,
    },
  },
  {
    path: `/authenticate`,
    name: "Authenticate",
    components: {
      default: Authenticate,
      navigation: NavigationComponentLite,
      // footer: FooterComponent,
    },
  },
  {
    path: `/authenticate/2fa`,
    name: "Authenticate2FA",
    components: {
      default: Authenticate2FA,
      navigation: NavigationComponentLite,
      // footer: FooterComponent,
    },
  },
];
