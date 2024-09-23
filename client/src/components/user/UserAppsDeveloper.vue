<template>
  <div class="userAppsDeveloper">
    <h2>{{ developer.name }}</h2>
    <div class="appContainer">
      <UserApp :app="app" v-for="(app, i) of developer.apps" :key="i" />
    </div>
  </div>
</template>

<script setup>
import UserApp from "./UserApp.vue";
import { defineProps } from "vue";
const props = defineProps(["developer"]);
</script>

<style scoped>
.userAppsDeveloper {
  color: #fff;
}
.userAppsDeveloper .appContainer {
  padding: 20px;
  margin: 10px 0 50px 0;
  border: 2px dotted var(--main-color-l);
  border-radius: 10px;
}
</style>
