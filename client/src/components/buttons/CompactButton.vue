<template>
  <button @click.stop="$emit('submit')">{{ text }}</button>
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

  border: none;
  border-radius: 2px;

  font-size: 16px;
  font-weight: 500;
  color: white;

  background-color: #97acdf;
  border: 1px solid #97acdf;
  cursor: pointer;
}
button:hover {
  background-color: #889dcd;
  border: 1px solid #889dcd;
}
</style>
