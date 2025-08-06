<template>
  <div>
    <Fonts />
    <ToasterManager />

    <RouterView name="navigation" @update-nav-height="updateNavHeight" />

    <div id="mainContentContainer" :style="`padding-top: ${navHeight}px`">
      <RouterView />
    </div>

    <RouterView name="footer" />
  </div>
</template>

<script setup>
import Fonts from "@/components/Fonts.vue";
import ToasterManager from "@/components/ToasterManager.vue";

import localeStore from "@/store/localeStore.js";
localeStore.loadLocaleFromUrl();

import { ref } from "vue";
const navHeight = ref(126);
const updateNavHeight = (newHeight) => {
  navHeight.value = newHeight;
  document.documentElement.style.setProperty("--nav-height", `${newHeight}px`);
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

body {
  min-height: 100vh;
  /* background-color: var(--sec-color-d); */
  background-color: #fff;
}

:root {
  --third-color-l: #fff;
  --third-color-d: #bbb;
  --sec-color-l: #2c2c2c;
  --sec-color-d: #1c1c1c;
  --main-color-l: #ec7837;
  --main-color-d: #9e4a1b;
  --nav-height: 400px;
}

h1 {
  font-size: 48px;
  font-weight: 800;
  line-height: 130%;
}
h2 {
  font-size: 36px;
  font-weight: 800;
  line-height: 130%;
}
h2.med {
  font-weight: 500;
}
h3 {
  font-size: 20px;
  font-weight: 500;
  line-height: 130%;
}
h4 {
  font-size: 16px;
  font-weight: 700;
}

.b1 {
  font-size: 20px;
  font-weight: 400;
}
.b1.med {
  font-weight: 500;
}
.b2 {
  font-size: 16px;
  font-weight: 400;
}
.b2.med {
  font-weight: 600;
}
.b3 {
  font-size: 14px;
  font-weight: 400;
}
.b3.med {
  font-weight: 500;
}
.b3.sb {
  font-weight: 700;
  line-height: 10px;
}

button {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  height: fit-content;
  width: fit-content;
}
button.bold {
  font-size: 16px;
  font-weight: 600;
}
button.med {
  font-size: 16px;
  font-weight: 500;
}

input {
  border-radius: 0;
}

.flexVert {
  display: flex;
  align-items: center;
}

.mW1400 {
  max-width: 1440px;
  padding: 0 20px;
  margin: 0 auto;
}

.mW1200 {
  max-width: 1240px;
  padding: 0 20px;
  margin: 0 auto;
}
.mW800 {
  max-width: 820px;
  padding: 0 10px;
  margin: 0 auto;
}
.mW500 {
  max-width: 510px;
  padding: 0 5px;
  margin: 0 auto;
}

a {
  text-decoration: none;
  color: var(--gray_2);
}

::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: #151415;
}
::-webkit-scrollbar-thumb {
  background: #2b2b30;
}
::-webkit-scrollbar-thumb:hover {
  background: #717171;
}

.hoverShadow {
  transition: 0.2s;
}
.hoverShadow:hover {
  transform: translate(-2px, -2px);
  box-shadow: 2px 2px 15px #0002;
}

.accordion-content {
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
  transition: 200ms;
}
.accordion-content.hidden {
  grid-template-rows: 0fr !important;
  opacity: 0;
}
.accordion-content div {
  overflow: hidden;
}

@keyframes loading {
  from {
    background-color: #ededed;
    background: linear-gradient(
        100deg,
        #ffffff00 40%,
        #ffffff80 50%,
        #ffffff00 60%
      )
      #ededed;
    background-size: 200% 100%;
    background-position-x: 180%;
    color: transparent;
  }
  to {
    background-color: #ededed;
    background: linear-gradient(
        100deg,
        rgba(255, 255, 255, 0) 40%,
        #ffffff80 50%,
        #ffffff00 60%
      )
      #ededed;
    background-size: 200% 100%;
    background-position-x: -20%;
    color: transparent;
  }
}

.container-standard {
  flex: 1;
  width: 100%;

  display: grid;
  grid-template-columns: 320px 320px;
  gap: 80px;

  max-width: 1240px;
  padding: 0 20px;
  margin: 0 auto;
}
.container-standard.wide {
  grid-template-columns: 420px 420px;
}
.container-standard .box {
  margin: 30px 0;
  width: 100%;
}
.container-standard .row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.container-standard .row img,
.container-standard .row svg {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #efefef;
}
.container-standard .form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
}
.container-standard h1 {
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
}
.container-standard h2 {
  font-size: 16px;
  font-weight: 400;
  color: #535353;
}
.container-standard p {
  font-size: 16px;
  font-weight: 400;
  color: #535353;
}

.sb {
  border: 1px solid #ddd;
}
.sbt {
  border-top: 1px solid #ddd;
}
.sbb {
  border-bottom: 1px solid #ddd;
}

@media only screen and (max-width: 1000px) {
  h1 {
    font-size: 32px;
  }
}
@media only screen and (max-width: 900px) {
  .container-standard {
    grid-template-columns: 320px;
  }
  .container-standard.wide {
    grid-template-columns: 420px;
  }
}
</style>

<style scoped>
#mainContentContainer {
  min-height: 100dvh;
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
}
</style>
