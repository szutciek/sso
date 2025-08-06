import ProfileList from "@/views/user/ProfileList.vue";
import NavigationComponent from "@/components/NavigationComponent.vue";
import NavigationComponentLite from "@/components/NavigationComponentLite.vue";
import FooterComponent from "@/components/FooterComponent.vue";
import CreateUser from "@/views/user/CreateUser.vue";

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
  {
    path: `/users/create`,
    name: "CreateUser",
    components: {
      default: CreateUser,
      navigation: NavigationComponentLite,
    },
  },
];
