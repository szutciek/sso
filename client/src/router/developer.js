import NavigationComponent from "@/components/NavigationComponent.vue";

import Documentation from "@/views/developer/Documentation.vue";

export default [
  {
    path: `/developer/documentation`,
    name: "DeveloperDocs",
    components: {
      default: Documentation,
      navigation: NavigationComponent,
    },
  },
];
