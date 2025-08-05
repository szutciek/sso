<template>
  <li class="appSharedItem">
    <img
      :src="`https://assets.kanapka.eu/images/permission-${item}.png`"
      alt="."
    />
    <p>{{ item }}</p>
  </li>
</template>

<script setup>
import { defineProps } from "vue";
const { item } = defineProps(["item"]);
</script>

<style scoped>
.appSharedItem {
  display: grid;
  align-items: center;
  grid-template-columns: 20px auto;
  gap: 10px;
  padding: 5px 10px;
}
.appSharedItem img {
  width: 100%;
  aspect-ratio: 1;
}
</style>
