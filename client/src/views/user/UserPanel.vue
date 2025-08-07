<template>
  <div class="userPanel">
    <div class="container-standard wide">
      <div class="box">
        <div class="row">
          <h1>{{ lS.localeKeys.UserPanel.title }}</h1>
        </div>
        <h2>{{ lS.localeKeys.UserPanel.description }}</h2>
      </div>
    </div>

    <ProfileCarousel
      :profiles="profileStore.profiles"
      :focusedIndex="focusedIndex"
      @snappedTo="handleCarouselSnap"
      @spinStart="handleCarouselSpin"
    />

    <div
      class="content-wrapper secondRow"
      ref="trustedAppsWrapper"
      v-show="focusedIndex != undefined"
    >
      <div class="content container-standard wide">
        <div class="form" v-if="focusedIndex != null">
          <AppDetailsUsersPerspective
            v-for="(app, i) of profileStore.profiles[focusedIndex].user?.apps"
            class="appItem"
            :style="`z-index: ${Math.min(i, 10)}`"
            :app="app"
            :profile="profileStore.profiles[focusedIndex]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.secondRow {
  margin-top: 20px;
}
.userPanel {
  margin-bottom: 30vh;
}
.container-theme {
  width: 100%;
  height: 100%;
}
.content-wrapper {
  max-height: 0px;
  overflow: hidden;
  transition: 0.2s ease;
}
.content-wrapper.open {
  max-height: 10000px;
}
.appItem {
  position: relative;
  box-shadow: 10px 10px 30px #00000014;
}
</style>

<script setup>
import lS from "@/store/localeStore.js";
import ProfileCarousel from "@/components/user/ProfileCarousel.vue";
import AppDetailsUsersPerspective from "@/components/app/AppDetailsUsersPerspective.vue";

import profileStore from "@/store/profileStore.js";
profileStore.getFullProfileList().catch((err) => {
  console.warn(err);
});

import { ref } from "vue";
const trustedAppsWrapper = ref();
const focusedIndex = ref(undefined);

const handleCarouselSpin = () => {
  focusedIndex.value = undefined;
  trustedAppsWrapper.value.classList.remove("open");
};
const handleCarouselSnap = (profileIndex) => {
  focusedIndex.value = profileIndex;
  trustedAppsWrapper.value.classList.add("open");
};
</script>
