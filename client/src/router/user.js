import ProfileList from "@/views/user/ProfileList.vue";
import NavigationComponent from "@/components/NavigationComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default [
  {
    path: `/users`,
    name: "ProfileList",
    components: {
      default: ProfileList,
      // navigation: NavigationComponent,
      footer: FooterComponent,
    },
  },
];
