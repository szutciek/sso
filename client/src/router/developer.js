import NavigationComponent from "@/components/NavigationComponent.vue";

import Documentation from "@/components/developer/Documentation.vue";

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
