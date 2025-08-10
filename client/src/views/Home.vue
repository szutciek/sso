<template>
  <div class="container mW1200">
    <div class="head">
      <div class="column">
        <h1 class="title">{{ lS.localeKeys.Home.title }}</h1>
        <p class="details">
          {{ lS.localeKeys.Home.subtitle }}
        </p>
        <button class="cta" @click="$router.push('/register')">
          {{ lS.localeKeys.Home.cta }} &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import lS from "@/store/localeStore";
</script>

<style scoped>
.head {
  height: calc(100vh - var(--nav-height));
}
.head .column {
  max-width: 800px;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;
}
.head .title {
  font-size: 48px;
  font-weight: 800;
}
.head .details {
  font-size: 20px;
  font-weight: 400;
}
.head .cta {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  border: none;
  padding: 12px 36px;
  border-radius: 4px;
  background-color: var(--main-color-l);
}
.head .cta:hover {
  background-color: var(--main-color-d);
}
</style>
