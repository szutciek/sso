<template>
  <div class="scrollArea" ref="scrollArea">
    <div class="scrollBox">
      <div class="box" v-for="(profile, i) in profiles" :key="profile.token">
        <UserDetailsPreview
          v-if="profile.user"
          :user="profile.user"
          :showView="focusedIndex === i"
          :showDefault="!profile.isDefault && focusedIndex === i"
          :token="profile.token"
        />
      </div>
      <div class="box">
        <AddProfileCard />
      </div>
    </div>
  </div>
</template>

<script setup>
import UserDetailsPreview from "@/components/user/UserDetailsPreview.vue";
import AddProfileCard from "@/components/user/AddProfileCard.vue";

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
        if (snappedBoxIndex === boxes.length - 1) {
          emit("snappedTo", null);
        } else {
          emit("snappedTo", snappedBoxIndex);
        }
      }
    }, 150);
  };

  handleScroll();
  scrollArea.value.addEventListener("scroll", handleScroll);

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      const boxes = scrollArea.value.querySelectorAll(".box");
      if (focusedIndex > 0) {
        const boxX = boxes[focusedIndex - 1].getBoundingClientRect().x;
        const areaX = scrollArea.value.getBoundingClientRect().x;
        scrollArea.value.scrollBy({
          left: boxX - areaX,
          behavior: "smooth",
        });
      }
    }
    if (e.key === "ArrowRight") {
      const boxes = scrollArea.value.querySelectorAll(".box");
      if (focusedIndex < boxes.length - 1) {
        const boxX = boxes[focusedIndex + 1].getBoundingClientRect().x;
        const areaX = scrollArea.value.getBoundingClientRect().x;
        scrollArea.value.scrollBy({
          left: boxX - areaX,
          behavior: "smooth",
        });
      }
    }
  });
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
  outline: none;
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
.box,
.ignoredBox {
  scroll-snap-align: start;
}
@media only screen and (max-width: 1240px) {
  .scrollArea {
    scroll-padding-left: 20px;
  }
  .scrollBox {
    padding-left: 20px;
    padding-right: 20px;
  }
}
@media only screen and (max-width: 540px) {
  .scrollBox {
    gap: 40px;
  }
}
@media only screen and (max-width: 460px) {
  .scrollBox {
    grid-auto-columns: calc(100vw - 40px);
  }
}
</style>
