<template>
  <div class="enumInput" :data-field="config.field" ref="inputRef">
    <div :class="['inputArea', error && 'errorState']">
      <h1>{{ config.label }}</h1>
      <div
        class="dropdown"
        tabindex="0"
        @focusout="onBlur"
        @click="open = !open"
        @keydown.enter.stop="open = !open"
        ref="dropdownRef"
      >
        <div :class="['selected', selected && 'active']">
          <span>{{ selected || "Click to select" }}</span>
          <span class="chevron">{{ open ? "▲" : "▼" }}</span>
        </div>

        <div v-show="open" class="dropdown-list">
          <div
            v-for="(option, index) in config.values"
            :key="option"
            class="dropdown-item"
            :class="{ active: option === selected }"
            tabindex="0"
            @click.stop="selectOption(option)"
            @keydown.enter.stop="selectOption(option)"
          >
            {{ option }}
          </div>
        </div>
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
import { ref, onMounted, defineProps, defineEmits, watch } from "vue";
const { config, selected, error } = defineProps([
  "config",
  "selected",
  "error",
]);
const emit = defineEmits(["input"]);

const dropdownRef = ref();
const open = ref(false);
const onBlur = () => {
  setTimeout(() => {
    if (!dropdownRef.value.contains(document.activeElement)) {
      open.value = false;
    }
  }, 1);
};

const selectOption = (option) => {
  emit("input", option, config.field);
  open.value = false;
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
.dropdown {
  cursor: pointer;
  position: relative;
  user-select: none;
  width: 100%;
  background: transparent;
}
.dropdown:focus,
.dropdown-item:focus {
  outline: 1px solid #2d2d2d;
  outline-offset: -1px;
}
.selected {
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  color: #2d2d2d;
  font-weight: 500;
}
.selected.active {
  background-color: #2d2d2d;
  color: #fff;
}
.selected span {
  font-size: 1rem;
}
.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid #ccc;
  background: white;
  z-index: 10;
  border-radius: 0;
}
.dropdown-item {
  padding: 4px 8px;
  border-top: 1px solid #eee;
  cursor: pointer;
}
.dropdown-item:first-child {
  border-top: none;
}
.dropdown-item:hover {
  background: #f0f0f0;
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
