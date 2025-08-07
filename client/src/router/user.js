import NavigationComponentLite from "@/components/NavigationComponentLite.vue";
import UserPanel from "@/views/user/UserPanel.vue";
import CreateUser from "@/views/user/CreateUser.vue";
import EditUser from "@/views/user/EditUser.vue";

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
    path: `/user/:_id/edit`,
    name: "EditUser",
    components: {
      default: EditUser,
      navigation: NavigationComponentLite,
    },
  },
];
