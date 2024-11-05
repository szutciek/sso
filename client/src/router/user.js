import AccountList from "@/views/user/AccountList.vue";
import AppDetails from "@/views/user/AppDetails.vue";
import AuthorizeApp from "@/views/user/AuthorizeApp.vue";

const base = "/:locale/user/apps";

export default [
  {
    path: `${base}`,
    name: "AccountList",
    components: {
      default: AccountList,
      // navigation: NavigationComponent,
      // footer: FooterComponent,
    },
  },
  {
    path: `${base}/:id`,
    name: "AppDetails",
    components: {
      default: AppDetails,
      // navigation: NavigationComponent,
      // footer: FooterComponent,
    },
  },
  {
    path: `${base}/authorize`,
    name: "AuthorizeApp",
    components: {
      default: AuthorizeApp,
      // navigation: NavigationComponent,
      // footer: FooterComponent,
    },
  },
];
