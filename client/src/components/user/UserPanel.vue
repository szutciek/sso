<template>
  <div class="userPanel">
    <div class="profiles">
      <div class="profile" v-for="(profile, i) of AccountListStore.profiles">
        <UserProfile
          :profile="profile"
          :selected="i === AccountListStore.selectedProfileIndex"
          @click="AccountListStore.selectNewProfile(i)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import UserProfile from "@/components/user/UserProfile.vue";
import lS from "@/store/localeStore.js";
import AccountListStore from "@/store/accountListStore.js";
</script>

<style scoped>
.userPanel {
  width: 100%;
  height: 100%;
  background-color: var(--sec-color-l);
  border-radius: 20px;
  color: #fff;
  overflow: hidden;
  padding: 10px;
}
.userPanel .label {
  padding: 0 0 10px 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--sec-color-l);
}
.userPanel .label p {
  color: var(--third-color-d);
}
.userPanel .profile {
  margin-bottom: 10px;
}
</style>
