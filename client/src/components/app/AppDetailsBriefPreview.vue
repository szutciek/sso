<template>
  <div class="appDetails">
    <img :src="app.icon" :alt="app.name" />
    <div>
      <h2>{{ app.name }}</h2>
      <p>By {{ app.developer.user.username }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
const { app } = defineProps(["app"]);
</script>

<style scoped>
.appDetails {
  display: grid;
  align-items: center;
  grid-template-columns: 60px auto;
  gap: 20px;
  padding: 20px 10px;
}
.appDetails img {
  width: 100%;
  aspect-ratio: 1;
}
.appDetails h2 {
  font-weight: 600;
}
</style>
