<template>
  <div class="scrollArea" ref="scrollArea">
    <div class="scrollBox">
      <div class="box" v-for="(profile, i) in profiles" :key="profile.token">
        <UserDetailsPreview
          v-if="profile.user"
          :user="profile.user"
          :showEdit="focusedIndex === i"
          :showDefault="!profile.isDefault && focusedIndex === i"
          :token="profile.token"
        />
      </div>
      <div class="noResults" v-if="profiles.length === 0">
        <p>No profiles</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserDetailsPreview from "@/components/user/UserDetailsPreview.vue";

import { ref, defineProps, defineEmits, onMounted } from "vue";
const { profiles, focusedIndex } = defineProps(["profiles", "focusedIndex"]);
const emit = defineEmits(["snappedTo", "spinStart"]);

let isSpinning = false;
let stillSpinningCheck = null;
let lastXPosition = 0;

const scrollArea = ref();

onMounted(() => {
  const getLeftmostBoxIndex = (elements) => {
    let leftmostBoxIndex = null;
    let minDistance = Infinity;

    elements.forEach((box, index) => {
      const boxRect = box.getBoundingClientRect();
      const containerRect = scrollArea.value.getBoundingClientRect();
      const distance = Math.abs(boxRect.left - containerRect.left);

      if (distance < minDistance) {
        minDistance = distance;
        leftmostBoxIndex = index;
      }
    });

    return leftmostBoxIndex;
  };

  const handleScroll = () => {
    if (!isSpinning) {
      emit("spinStart");
    }
    isSpinning = true;
    const boxes = scrollArea.value.querySelectorAll(".box");
    if (boxes.length === 0) return;
    lastXPosition = boxes[0].getBoundingClientRect().x;
    clearTimeout(stillSpinningCheck);
    const snappedBoxIndex = getLeftmostBoxIndex(boxes);
    stillSpinningCheck = setTimeout(() => {
      const newXPosition = boxes[0].getBoundingClientRect().x;
      if (newXPosition === lastXPosition) {
        isSpinning = false;
        emit("snappedTo", snappedBoxIndex);
      }
    }, 150);
  };

  handleScroll();
  scrollArea.value.addEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.scrollArea {
  width: 100vw;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  scroll-padding-left: calc((100vw - 1240px) / 2 + 20px);
  scrollbar-width: none;
}
.scrollArea::-webkit-scrollbar {
  display: none;
}
.scrollBox {
  padding-left: calc((100vw - 1240px) / 2 + 20px);
  padding-right: calc(100vw - (100vw - 1240px) / 2 - 440px);
  width: fit-content;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 420px;
  gap: 80px;
}
.box {
  scroll-snap-align: start;
}
</style>
