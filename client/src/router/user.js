import NavigationComponentLite from "@/components/NavigationComponentLite.vue";
import UserPanel from "@/views/user/UserPanel.vue";
import CreateUser from "@/views/user/CreateUser.vue";
import UserDetails from "@/views/user/UserDetails.vue";
import EditUser from "@/views/user/EditUser.vue";
import UserPasswordReset from "@/views/user/UserPasswordReset.vue";

export default [
  {
    path: `/register`,
    name: "CreateUser",
    components: {
      default: CreateUser,
      navigation: NavigationComponentLite,
    },
  },
  {
    path: `/user/panel`,
    name: "UserPanel",
    components: {
      default: UserPanel,
      navigation: NavigationComponentLite,
    },
  },
  {
    path: `/user/:_id/details`,
    name: "UserDetails",
    components: {
      default: UserDetails,
      navigation: NavigationComponentLite,
    },
  },
  {
    path: `/user/:_id/edit`,
    name: "EditUser",
    components: {
      default: EditUser,
      navigation: NavigationComponentLite,
    },
  },
  {
    path: `/user/:_id/reset-password`,
    name: "UserPasswordReset",
    components: {
      default: UserPasswordReset,
      navigation: NavigationComponentLite,
    },
  },
];
