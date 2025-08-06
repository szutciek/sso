<template>
  <div class="enumInput" :data-field="config.field" ref="inputRef">
    <div :class="['inputArea', error && 'errorState']">
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
    <div class="errorArea" :style="!error && 'display: none'">
      <!-- prettier-ignore -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M248,64C146.39,64,64,146.39,64,248s82.39,184,184,184,184-82.39,184-184S349.61,64,248,64Z" style="fill:none;stroke:#FFF;stroke-miterlimit:10;stroke-width:32px"/><polyline points="220 220 252 220 252 336" style="fill:none;stroke:#FFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><line x1="208" y1="340" x2="296" y2="340" style="fill:none;stroke:#FFF;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px"/><path style="fill:#FFF" d="M248,130a26,26,0,1,0,26,26A26,26,0,0,0,248,130Z"/></svg>
      <h6 id="error">{{ error }}</h6>
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
  emit(
    "input",
    new Date(year.value, month.value - 1, day.value).getTime(),
    config.field
  );
};
</script>

<style scoped>
.inputArea {
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
.inputArea.errorState {
  border: 1px solid #ef5f5f;
}
.inputArea h1 {
  font-size: 1rem;
  font-weight: 400;
  color: #a4a4a4;
  margin-bottom: 4px;
}
.inputArea.errorState h1 {
  color: #ef5f5f;
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
  color: #777;
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

.errorArea {
  display: grid;
  justify-content: left;
  align-items: center;
  grid-template-columns: 1rem auto;
  gap: 0.3rem;

  padding: 0.15rem 0.3rem;
  transition: 0.2s;
  background-color: #ef5f5f;
  border-radius: 0 0 2px 2px;
  user-select: none;
  pointer-events: none;
}
.errorArea svg {
  width: 1rem;
  height: 1rem;
}
.errorArea h6 {
  font-size: 0.8rem;
  font-weight: 400;
  color: #ffffff;
}
</style>
