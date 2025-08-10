<template>
  <button
    :class="[`button`, state]"
    @click.stop="state === `default` && emit(`submit`)"
  >
    {{ text }}
    <div v-if="state === 'loading'" class="loader"></div>
  </button>
</template>

<style scoped>
button {
  padding: 4px 16px;

  border: none;
  border-radius: 0;
  background-color: transparent;

  font-size: 16px;
  font-weight: 300;
  color: #777;

  cursor: pointer;
}
button.default:hover {
  background-color: #0001;
}
.loading {
  cursor: not-allowed;
}

.loader {
  border: 0.2rem solid #fff6;
  border-left: 0.2rem solid #0004;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

<script setup>
import { defineProps, defineEmits, onMounted, onUnmounted } from "vue";
const { state, text, ignoreEnter } = defineProps([
  "state",
  "text",
  "ignoreEnter",
]);

const submitViaKey = (e) => {
  if (e.key === "Enter" && state === "default") {
    if (ignoreEnter) return;
    emit("submit");
  }
};
onMounted(() => {
  window.addEventListener("keypress", submitViaKey);
});
onUnmounted(() => {
  window.removeEventListener("keypress", submitViaKey);
});

const emit = defineEmits(["submit"]);
</script>
