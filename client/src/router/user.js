import AccountList from "@/views/AccountList.vue";

export default [
  {
    path: "/:locale",
    name: "AccountList",
    components: {
      default: AccountList,
      // navigation: NavigationComponent,
      // footer: FooterComponent,
    },
  },
];
