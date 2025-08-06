<template>
  <button
    :class="[`button`, state]"
    @click="state === `default` && emit(`submit`)"
  >
    <div v-if="state === 'loading'" class="loader"></div>
    {{ state !== "loading" ? text || "&nbsp;" : "" }}
  </button>
</template>

<style scoped>
button {
  width: 100%;
  padding: 0.75rem;

  border: none;
  border-radius: 2px;

  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 500;
  color: #889dcd;

  background-color: #fff;
  border: 1px solid #97acdf;
  cursor: pointer;
}
button.default:hover {
  color: #889dcd;
  background-color: #eee9;
  border: 1px solid #889dcd;
}
.loading {
  color: #889dcd;
  border: 1px solid #889dcd;
  cursor: not-allowed;
}
.success {
  color: #55b94e;
  border: 1px solid #55b94e;
  cursor: not-allowed;
}

.loader {
  border: 0.2rem solid #0001;
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

const submitViaKey = (e) => {
  if (e.key === "Enter" && state === "default") {
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

const { state, text } = defineProps(["state", "text"]);
</script>
