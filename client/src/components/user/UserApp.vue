<template>
  <div class="userApp">
    <h3>{{ props.app.name }}</h3>
    <p>{{ lS.localeKeys.UserApp.shared }}:</p>
    <ul>
      <li v-for="shared of props.app.shared">
        {{ shared }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import lS from "@/store/localeStore.js";
import { defineProps } from "vue";
const props = defineProps(["app"]);
</script>

<style scoped>
.userApp {
  background-color: #0004;
}
</style>
