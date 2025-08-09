<template>
  <div class="scrollArea" ref="scrollArea">
    <div class="scrollBox">
      <div
        class="box carousel-Bubble-Catcher"
        v-for="(profile, i) in profiles"
        :key="profile.token"
      >
        <UserDetailsPreview
          :class="['pfl', focusedIndex === i && 'active']"
          :user="profile.user"
          :showView="focusedIndex === i"
          :showDefault="!profile.isDefault && focusedIndex === i"
          :token="profile.token"
        />
      </div>
      <div class="box carousel-Bubble-Catcher">
        <AddProfileCard :class="['pfl', focusedIndex === null && 'active']" />
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
    if (!isSpinning) emit("spinStart");
    isSpinning = true;

    const boxes = scrollArea.value.querySelectorAll(".box");
    if (boxes.length === 0) return;

    lastXPosition = boxes[0].getBoundingClientRect().x;
    const snappedBoxIndex = getLeftmostBoxIndex(boxes);

    clearTimeout(stillSpinningCheck);

    stillSpinningCheck = setTimeout(() => {
      const newXPosition = boxes[0].getBoundingClientRect().x;
      if (newXPosition === lastXPosition) {
        isSpinning = false;

        const targetBoxRect = boxes[snappedBoxIndex].getBoundingClientRect();
        if (targetBoxRect.x !== 20) return;

        if (snappedBoxIndex === boxes.length - 1) {
          emit("snappedTo", null);
        } else {
          if (snappedBoxIndex !== focusedIndex) {
            emit("snappedTo", snappedBoxIndex);
          }
        }
      }
    }, 100);
  };

  handleScroll();
  scrollArea.value.addEventListener("scroll", handleScroll);

  scrollArea.value.addEventListener("click", (e) => {
    if (!scrollArea.value) return;
    const targetBox = e.target.closest(".carousel-Bubble-Catcher");
    if (!targetBox) return;
    if (targetBox.querySelector(".active")) return;
    const boxX = targetBox.getBoundingClientRect().x;
    const areaX = scrollArea.value.getBoundingClientRect().x;
    scrollArea.value.scrollBy({
      left: boxX - areaX,
      behavior: "smooth",
    });
  });

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
  overflow-y: visible;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  scroll-padding-left: calc((100vw - 1240px) / 2 + 20px);
  scrollbar-width: none;
  outline: none;

  margin: -40px 0;
  padding: 40px 0;
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
.pfl {
  filter: grayscale(1);
  opacity: 0.5;
  transform: scale(0.98);
  transition: 0.2s;
  cursor: pointer;
}
.active {
  filter: grayscale(0);
  opacity: 1;
  transform: scale(1);
  box-shadow: 10px 10px 30px #00000014;
  cursor: unset;
}
@media only screen and (max-width: 1240px) {
  .scrollArea {
    scroll-padding-left: 20px;
  }
  .scrollBox {
    padding-left: 20px;
    padding-right: calc(100vw - 440px);
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
    padding-right: 20px;
  }
}
</style>
