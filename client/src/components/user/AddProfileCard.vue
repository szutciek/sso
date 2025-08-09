<template>
  <div class="addProfile sb">
    <div class="section main sbb">
      <div class="addIcon">
        <h1>+</h1>
      </div>
      <div>
        <h2>{{ lS.localeKeys.AddProfileCard.title }}</h2>
        <p>{{ lS.localeKeys.AddProfileCard.description }}</p>
      </div>
    </div>
    <div class="section buttons">
      <div class="button">
        <CompactButtonEmpty
          @submit="handleReroute('/authenticate')"
          :text="lS.localeKeys.AddProfileCard.signin"
        />
      </div>
      <div class="button">
        <CompactButtonEmpty
          @submit="handleReroute('/register')"
          :text="lS.localeKeys.AddProfileCard.signup"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import lS from "@/store/localeStore";
import CompactButton from "@/components/buttons/CompactButton.vue";
import CompactButtonEmpty from "@/components/buttons/CompactButtonEmpty.vue";
import { useRouter } from "vue-router";
const router = useRouter();
const handleReroute = (path) => {
  router.push(path);
};
</script>

<style scoped>
.addProfile {
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.section {
  padding: 0 20px;
}
.main {
  display: grid;
  align-items: center;
  grid-template-columns: 60px auto;
  gap: 20px;
  padding-bottom: 20px;
}
.main .addIcon {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: #eee;
}
.main .addIcon h1 {
  text-align: center;
  font-size: 60px;
  font-weight: 300;
  line-height: 1;
}
.main h2 {
  font-size: 16px;
  color: #2d2d2d;
  font-weight: 600;
}
.main p {
  font-size: 16px;
  font-weight: 400;
  color: #888;
}
.buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.buttons .button {
  flex: 1;
}
</style>
