<template>
  <li class="appSharedItem">
    <img
      :src="`https://assets.kanapka.eu/images/permission-${item.field}.png`"
      alt="."
    />
    <p>{{ item.label }}</p>
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
  padding: 5px 0;
}
.appSharedItem img {
  width: 100%;
  aspect-ratio: 1;
}
</style>
