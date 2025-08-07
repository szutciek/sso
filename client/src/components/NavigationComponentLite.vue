<template>
  <nav ref="nav" class="keep-dropdown-open">
    <div class="bar mW1200">
      <div class="logo">
        <div class="extension"></div>
        <Logo class="graphic" />
      </div>
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

  padding: 50px 10px 10px 10px;

  /* background-color: #fff; */
  /* border-bottom: 1px solid #ddd; */
  background-color: #fff4;
  backdrop-filter: blur(5px);
}
.bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bar .logo {
  position: relative;
}
.bar .logo .extension {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  height: 500px;
  background-color: var(--main-color-l);

  overflow: hidden;
  border-radius: 0 0 4px 4px;
}

@media screen and (max-width: 800px) {
  .bar {
    padding: 0;
  }
}
</style>

<script setup>
import Logo from "@/components/LogoComponent.vue";

import { defineEmits, ref, onMounted } from "vue";
const emit = defineEmits(["update-nav-height"]);
const nav = ref(null);
onMounted(() => {
  emit("update-nav-height", nav.value.getBoundingClientRect().height);
});
</script>
