<template>
  <div class="container mW1400">
    <div class="grid">
      <div class="userPanelComponent">
        <UserPanel />
      </div>
      <div class="userAppsComponent">
        <UserApps />
      </div>

      <TileBackground />
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 2fr 5fr;
  gap: 40px;

  height: 100%;
  width: 100%;
}
.userPanelComponent,
.userAppsComponent {
  width: 100%;
  overflow: hidden;
}
.userPanelComponent,
.userAppsComponent {
  height: 100vh;
  padding: 20px 0;
}
</style>

<script setup>
import lS from "@/store/localeStore";

import UserPanel from "@/components/user/UserPanel.vue";
import UserApps from "@/components/user/UserApps.vue";

import TileBackground from "@/components/TileBackground.vue";
</script>
