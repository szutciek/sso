<template>
  <div class="enumInput" :data-field="config.field" ref="inputRef">
    <div class="inputBox">
      <h1>{{ config.label }}</h1>
      <ul>
        <li
          v-for="opt of config.enum"
          @click="$emit('input', opt, config.field)"
          :class="[opt == selected && 'active']"
        >
          {{ opt.toString() }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, watch } from "vue";
const { config, selected, error } = defineProps([
  "config",
  "selected",
  "error",
]);
const emit = defineEmits(["input"]);
</script>

<style scoped>
.inputBox {
  background-color: transparent;
  border: none;
  outline: none;

  width: 100%;
  padding: 0.6rem 0.5rem;
  background-color: white;

  font-size: 1rem;
  font-weight: 500;
  color: #2d2d2d;

  border: 1px solid #b9b9b9;
  border-radius: 2px;
}
.inputBox h1 {
  font-size: 1rem;
  font-weight: 400;
  color: #a4a4a4;
}
.inputBox ul {
  display: flex;
  gap: 8px;
}
.inputBox ul li {
  cursor: pointer;
  list-style: none;
  padding: 4px 8px;
}
.inputBox ul li:hover {
  background-color: #eee;
}
.inputBox ul li.active {
  background-color: #2d2d2d;
  color: #fff;
}
</style>
