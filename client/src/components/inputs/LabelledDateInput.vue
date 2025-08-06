<template>
  <div class="enumInput" :data-field="config.field" ref="inputRef">
    <div class="inputBox">
      <h1>{{ config.label }}</h1>
      <div class="date-input">
        <h2>
          <input
            class="day"
            type="text"
            v-model="day"
            maxlength="2"
            inputmode="numeric"
            pattern="\d*"
            placeholder="DD"
            @input="handleInput"
            ref="dayInput"
            data-field="day"
          />
          <span>-</span>
          <input
            class="month"
            type="text"
            v-model="month"
            maxlength="2"
            inputmode="numeric"
            pattern="\d*"
            placeholder="MM"
            @input="handleInput"
            ref="monthInput"
            data-field="month"
          />
          <span>-</span>
          <input
            class="year"
            type="text"
            v-model="year"
            maxlength="4"
            inputmode="numeric"
            pattern="\d*"
            placeholder="YYYY"
            @input="handleInput"
            ref="yearInput"
          />
        </h2>
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

const monthInput = ref();
const yearInput = ref();

const handleInput = (e) => {
  if (e.target.value.length === 2) {
    if (e.target.dataset.field === "day") {
      monthInput.value.focus();
    }
    if (e.target.dataset.field === "month") {
      yearInput.value.focus();
    }
  }
  emit("input", new Date(year.value, month.value - 1, day.value), config.field);
};
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
.date-input input {
  border: none;
  background-color: transparent;
  outline: none;
  box-shadow: none;

  font-size: 16px;
  color: #000;
  text-align: center;
}
.date-input input::placeholder {
  color: #2d2d2d;
}
.date-input input.day {
  width: 28px;
}
.date-input input.month {
  width: 32px;
}
.date-input input.year {
  width: 44px;
}
</style>
