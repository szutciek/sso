<template>
  <div class="addProfile sb">
    <div class="section main sbb">
      <div class="addIcon">
        <h1>+</h1>
      </div>
      <div>
        <h2>Add profile</h2>
        <p>Click one of the buttons below.</p>
      </div>
    </div>
    <div class="section buttons">
      <div class="button">
        <CompactButtonEmpty
          @submit="handleReroute('/authenticate')"
          text="Sign In"
        />
      </div>
      <div class="button">
        <CompactButtonEmpty
          @submit="handleReroute('/register')"
          text="Create Account"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
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
