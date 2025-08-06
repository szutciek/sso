<template>
  <div class="fancyInput" :data-field="config.field" ref="inputRef">
    <div class="inputArea">
      <p id="placeholder">{{ config.label }}</p>
      <input
        :type="config.type"
        v-model="value"
        @focus="handleInputEnter(inputRef)"
        @blur="handleInputLeave(inputRef)"
        @input="handleInput(inputRef)"
      />
    </div>
    <div class="errorArea hidden">
      <!-- prettier-ignore -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M248,64C146.39,64,64,146.39,64,248s82.39,184,184,184,184-82.39,184-184S349.61,64,248,64Z" style="fill:none;stroke:#FFF;stroke-miterlimit:10;stroke-width:32px"/><polyline points="220 220 252 220 252 336" style="fill:none;stroke:#FFF;stroke-linecap:round;stroke-linejoin:round;stroke-width:32px"/><line x1="208" y1="340" x2="296" y2="340" style="fill:none;stroke:#FFF;stroke-linecap:round;stroke-miterlimit:10;stroke-width:32px"/><path style="fill:#FFF" d="M248,130a26,26,0,1,0,26,26A26,26,0,0,0,248,130Z"/></svg>
      <h6 id="error"></h6>
    </div>
  </div>
</template>

<style scoped>
.inputArea {
  position: relative;
}
.fancyInput .inputArea p {
  position: absolute;
  top: 50%;
  left: 0.3rem;
  /* to hide chrome autofill */
  width: calc(100% - 0.6rem);
  background-color: white;
  border-radius: 2px;

  user-select: none;
  pointer-events: none;
  line-height: 1rem;
  padding: 0.2rem;

  font-size: 1rem;
  font-weight: 400;
  color: #a4a4a4;

  transform: translateY(-50%);
  transition: 0.2s font-size, 0.2s top;
}
.fancyInput .inputArea input {
  background-color: transparent;
  border: none;
  outline: none;

  /* height breaks? */
  height: 3rem;
  width: 100%;
  padding: 0.6rem 0.5rem;
  background-color: white;

  font-size: 1rem;
  font-weight: 500;
  color: #2d2d2d;

  border: 1px solid #b9b9b9;
  border-radius: 2px;
  transition: 0.2s;
}
.fancyInput .errorArea {
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
.fancyInput .errorArea svg {
  width: 1rem;
  height: 1rem;
}
.fancyInput .errorArea h6 {
  font-size: 0.8rem;
  font-weight: 400;
  color: #ffffff;
}
.hidden {
  display: none !important;
}
</style>

<script setup>
import { ref, onMounted, defineProps, defineEmits, watch } from "vue";

const { config, error } = defineProps(["config", "error"]);
const emit = defineEmits(["input"]);

const inputRef = ref(null);
const value = ref("");

const handleInput = (i) => {
  handleInputChange(i);
  emit("input", value.value, config.field);
};

watch(
  () => error,
  (newError, oldError) => {
    if (newError) {
      handleInputError(newError);
    }
  }
);
onMounted(() => {
  if (error) {
    handleInputError(error);
  }
});

const handleInputEnter = (i) => {
  const placeholder = i.querySelector("#placeholder");
  const input = i.querySelector("input");

  if (!i.dataset.error) {
    input.style.borderColor = "#97acdf";
    placeholder.style.color = "#97acdf";
  }

  placeholder.style.fontSize = "0.8rem";
  placeholder.style.top = "0";
  placeholder.style.width = "auto";
};

const handleInputLeave = (i) => {
  const placeholder = i.querySelector("#placeholder");
  const input = i.querySelector("input");

  if (!i.dataset.error) {
    placeholder.style.color = "#a4a4a4";
    input.style.borderColor = "#b9b9b9";
  }

  if (!i.querySelector("input").value) {
    placeholder.style.fontSize = "1rem";
    placeholder.style.top = "50%";
  }
};

const handleInputError = (message) => {
  const i = inputRef.value;
  i.dataset.error = 1;

  const placeholder = i.querySelector("#placeholder");
  const input = i.querySelector("input");
  placeholder.style.color = "#ef5f5f";
  input.style.borderColor = "#ef5f5f";
  input.style.borderRadius = "2px 2px 0 0";
  const errorArea = i.querySelector(".errorArea");
  errorArea.querySelector("h6").innerText = message;
  errorArea.classList.remove("hidden");
};

const handleInputChange = (i) => {
  const placeholder = i.querySelector("#placeholder");
  const input = i.querySelector("input");
  const errorArea = i.querySelector(".errorArea");

  if (input === document.activeElement) {
    input.style.borderColor = "#97acdf";
    placeholder.style.color = "#97acdf";
  } else {
    placeholder.style.color = "#a4a4a4";
    input.style.borderColor = "#b9b9b9";
  }
  input.style.borderRadius = "2px";
  errorArea.classList.add("hidden");
  errorArea.querySelector("h6").innerText = "";
  delete i.dataset?.error;
};

const animateButton = (state) => {
  const button = document.getElementById("submit");
  if (state === "default") {
    button.innerHTML = "Sign in";
    button.style.backgroundColor = "#97acdf";
    button.style.cursor = "pointer";
  }
  if (state === "loading") {
    button.innerHTML = '<div class="loader"></div>';
    button.style.backgroundColor = "#889dcd";
    button.style.cursor = "default";
  }
  if (state === "success") {
    button.innerHTML = "Success!";
    button.style.backgroundColor = "#55b94e";
    button.style.cursor = "not-allowed";
  }
};
</script>
