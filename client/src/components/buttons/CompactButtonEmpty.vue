<template>
  <button @click="$emit('submit')">{{ text }}</button>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";
const emit = defineEmits(["submit"]);
const { text } = defineProps(["text"]);
</script>

<style scoped>
button {
  padding: 4px 8px;
  width: 100%;

  font-size: 16px;
  font-weight: 500;
  color: #889dcd;

  border: none;
  border-radius: 2px;

  background-color: #fff;
  border: 1px solid #97acdf;
  cursor: pointer;
}
button:hover {
  color: #889dcd;
  background-color: #eee9;
  border: 1px solid #889dcd;
}
</style>
