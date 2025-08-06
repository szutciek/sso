<template>
  <div class="enumInput" :data-field="config.field" ref="inputRef">
    <div class="inputBox">
      <h1>{{ config.label }}</h1>
      <div
        class="dropdown"
        tabindex="0"
        @focusout="onBlur"
        @click="open = !open"
        @keydown.enter="open = !open"
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
            @keydown.enter="selectOption(option)"
          >
            {{ option }}
          </div>
        </div>
      </div>
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
.dropdown {
  cursor: pointer;
  position: relative;
  user-select: none;
  width: 200px;
  background: transparent;
}

.selected {
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  padding: 4px 8px;
  color: #000;
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
</style>
