<template>
  <div class="userApps">
    <div class="developers">
      <div
        class="developer"
        v-for="(dev, i) of profileStore.getCurrentProfile().authorizedApps"
      >
        <UserAppsDeveloper :developer="dev" />
      </div>
    </div>
  </div>
</template>

<script setup>
import profileStore from "@/store/profileStore.js";
import UserAppsDeveloper from "@/components/user/UserAppsDeveloper.vue";
</script>

<style scoped>
.userApps {
  padding: 20px;
  background-color: var(--sec-color-l);
  border-radius: 20px;
}
</style>
