<template>
  <div class="enumInput" :data-field="config.field" ref="inputRef">
    <div class="inputBox">
      <h1>{{ config.label }}</h1>
      <div class="date-input">
        <label>
          Day:
          <input
            type="number"
            v-model="day"
            min="1"
            max="31"
            @input="emitDate"
          />
        </label>

        <label>
          Month:
          <input
            type="number"
            v-model="month"
            min="1"
            max="12"
            @input="emitDate"
          />
        </label>

        <label>
          Year:
          <input
            type="number"
            v-model="year"
            min="1900"
            max="2100"
            @input="emitDate"
          />
        </label>

        <p v-if="formattedDate">Selected Date: {{ formattedDate }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, watch, computed } from "vue";
const { config, selected, error } = defineProps([
  "config",
  "selected",
  "error",
]);
const emit = defineEmits(["input"]);

const day = ref();
const month = ref();
const year = ref();

const emitDate = () => {
  if (isValidDate()) {
    emit("input", formattedDate.value, config.field);
  } else {
    emit("input", null);
  }
};

const isValidDate = () => {
  const d = parseInt(day.value);
  const m = parseInt(month.value);
  const y = parseInt(year.value);
  if (!d || !m || !y) return false;

  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
};

const formattedDate = computed(() => {
  if (isValidDate()) {
    const d = String(day.value).padStart(2, "0");
    const m = String(month.value).padStart(2, "0");
    const y = String(year.value);
    return `${y}-${m}-${d}`;
  }
  return "";
});
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
.date-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.date-input label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
}
</style>
