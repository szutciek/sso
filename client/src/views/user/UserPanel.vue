<template>
  <div class="userPanel">
    <div class="container-standard wide">
      <div class="box">
        <div class="row">
          <h1>Available Profiles</h1>
        </div>
        <h2>Scroll to a profile to get more information.</h2>
      </div>
    </div>

    <ProfileCarousel
      :profiles="profileStore.profiles"
      :focusedIndex="focusedProfileIndex"
      @snappedTo="handleCarouselSnap"
      @spinStart="handleCarouselSpin"
    />

    <div
      class="content-wrapper"
      ref="trustedAppsWrapper"
      v-show="focusedProfileIndex != undefined"
    >
      <div class="content container-standard wide">
        <div class="box">
          <!-- <div class="row">
            <h1>Apps Trusted by Profile</h1>
          </div>
          <h2>List of apps this profile has interacted with.</h2> -->

          <div class="form" v-if="focusedProfileIndex != null">
            <div
              class="app sbt"
              v-for="app of profileStore.profiles[focusedProfileIndex].user
                ?.apps"
            >
              <h2>{{ app.app.name }}</h2>
              <p>{{ app.status }}</p>
            </div>
            <div
              class="app sbt"
              v-if="
                profileStore.profiles[focusedProfileIndex].user?.apps.length ===
                0
              "
            >
              <p>No apps</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
.app {
  padding: 20px 10px;
}
</style>

<script setup>
import ProfileCarousel from "@/components/user/ProfileCarousel.vue";
import AppDetailsPreview from "@/components/app/AppDetailsPreview.vue";

import profileStore from "@/store/profileStore.js";
profileStore.getFullProfileList().catch((err) => {
  console.log(err);
});

import { ref } from "vue";
const trustedAppsWrapper = ref();
const focusedProfileIndex = ref(0);

const handleCarouselSpin = () => {
  focusedProfileIndex.value = null;
  trustedAppsWrapper.value.classList.remove("open");
};
const handleCarouselSnap = (profileIndex) => {
  focusedProfileIndex.value = profileIndex;
  trustedAppsWrapper.value.classList.add("open");
};
</script>
