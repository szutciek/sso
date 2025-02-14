<template>
  <Transition>
    <div
      class="dropdown keep-dropdown-open"
      :style="`top: ${positionTop}px`"
      v-if="dropdownOpen"
    >
      <div class="box">
        <div class="topic" v-for="item of currentDropdown.items">
          <div class="large" v-if="item.type === 'large'">
            <div class="text">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
            <img :src="item.image" alt="icon" />
          </div>

          <div class="list" v-if="item.type === 'list'">
            <h3>{{ item.title }}</h3>
            <ul>
              <li
                @click="$router.push(element.link)"
                v-for="element of item.list"
              >
                {{ element.text }} &rarr;
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.dropdown {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  z-index: -1000;
  padding: 10px;
}
.dropdown .box {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}
.dropdown .box .topic {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.dropdown .box .topic h3 {
  font-size: 18px;
  font-weight: 600;
  color: #2b2b2b;
  margin-bottom: 4px;
}
.dropdown .box .topic p,
.dropdown .box .topic li {
  font-size: 14px;
  font-weight: 400;
  color: #313131;
}
.dropdown .box .topic .large {
  position: relative;
  min-height: 160px;

  background-color: #eee;
  box-shadow: inset 0 0 10px 5px #e9e9e9;
  border-radius: 4px;
  padding: 20px;
  cursor: pointer;
}
.dropdown .box .topic .large img {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 100px;
}
.dropdown .box .topic .list {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
}
.dropdown .box .topic .list li {
  list-style: none;
  cursor: pointer;
}

.v-enter-active,
.v-leave-active {
  transition: 0.2s ease-out;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>

<script setup>
import { defineProps, onMounted, onUnmounted, ref } from "vue";

const { config } = defineProps(["config"]);

const dropdownOpen = ref(false);
const positionTop = ref(0);
const currentDropdown = ref(null);

const openDropdown = (dropdown) => {
  currentDropdown.value = dropdown;
  dropdownOpen.value = true;
};

const closeDropdown = () => {
  if (dropdownOpen.value === false) return;
  dropdownOpen.value = false;
};

const mouseCallback = (e) => {
  if (e.target.closest(".drop")) {
    const item = config.items.find((item) => {
      return (
        item.interactionId === e.target.closest(".drop").dataset.interactionid
      );
    });
    const dropdown = config.drops[item.dropIndex];
    return openDropdown(dropdown);
  }
  if (e.target.closest(".close-dropdown")) {
    return closeDropdown();
  }
  if (!e.target.closest(".keep-dropdown-open")) {
    return closeDropdown();
  }
};

const resizeCallback = () => {
  positionTop.value = document
    .querySelector("nav")
    .getBoundingClientRect().bottom;
};

onMounted(() => {
  document.addEventListener("mouseover", mouseCallback);
  window.addEventListener("resize", resizeCallback);
  resizeCallback();
});
onUnmounted(() => {
  document.removeEventListener("mouseover", mouseCallback);
});
</script>
