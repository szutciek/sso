<template>
  <nav ref="nav">
    <div class="bar mW1200">
      <div class="logo">
        <div class="extension"></div>
        <Logo class="graphic" />
      </div>

      <ul>
        <li>Panel</li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  padding: 10px;

  background-color: #fff;
  border-bottom: 1px solid #ddd;
}
.bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bar ul {
  display: flex;
  flex: 2;
  gap: 24px;
  padding: 0 40px;
  list-style: none;
}
.bar li {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  padding: 8px 16px;
  cursor: pointer;
}

@media screen and (max-width: 800px) {
  .bar {
    padding: 0;
  }
  .bar ul {
    gap: 12px;
    padding: 0 20px;
  }
  .bar li {
    padding: 8px 12px;
  }
}
</style>

<script setup>
import { defineEmits, ref, onMounted } from "vue";
const emit = defineEmits(["update-nav-height"]);
const nav = ref(null);
onMounted(() => {
  emit("update-nav-height", nav.value.getBoundingClientRect().height);
});

import lS from "@/store/localeStore";

import Logo from "@/components/LogoComponent.vue";
</script>
