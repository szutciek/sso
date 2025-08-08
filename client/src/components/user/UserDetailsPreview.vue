<template>
  <div class="userDetails sb">
    <div class="section main sbb">
      <div :class="[loading && 'loadingItem']">
        <img
          :src="display.profile"
          :alt="display.username"
          :class="!highlight?.includes('profile') && 'decreaseVisibility'"
        />
      </div>
      <div>
        <h2
          :class="[
            loading && 'loadingItem',
            !highlight?.includes('username') && 'decreaseVisibility',
          ]"
        >
          {{ display.username || "..." }}
        </h2>
        <p
          :class="[
            loading && 'loadingItem',
            !highlight?.includes('email') && 'decreaseVisibility',
          ]"
        >
          {{ display.email || "..." }}
        </p>
      </div>
    </div>
    <div class="section">
      <p :class="loading && 'loadingItem'">Personal Details</p>
      <ul class="keyVal">
        <li
          :class="[
            loading && 'loadingItem',
            !highlight?.includes('birthday') && 'decreaseVisibility',
          ]"
        >
          <span>Birthday</span>
          <span>{{
            display.birthday
              ? new Date(display.birthday)?.toLocaleDateString()
              : "..."
          }}</span>
        </li>
        <li
          :class="[
            loading && 'loadingItem',
            !highlight?.includes('gender') && 'decreaseVisibility',
          ]"
        >
          <span>Gender</span><span>{{ display.gender || "..." }}</span>
        </li>
      </ul>
    </div>
    <div class="section">
      <p :class="loading && 'loadingItem'">Region & Language</p>
      <ul class="keyVal">
        <li
          :class="[
            loading && 'loadingItem',
            !highlight?.includes('locale') && 'decreaseVisibility',
          ]"
        >
          <span>Region</span>
          <span>{{ display.locale || "..." }}</span>
        </li>
        <li
          :class="[
            loading && 'loadingItem',
            !highlight?.includes('language') && 'decreaseVisibility',
          ]"
        >
          <span>Language</span>
          <span>{{ display.language || "..." }}</span>
        </li>
      </ul>
    </div>
    <div class="section">
      <p :class="loading && 'loadingItem'">Security Settings</p>
      <ul class="keyVal">
        <li
          :class="[
            loading && 'loadingItem',
            !highlight?.includes('use2FA') && 'decreaseVisibility',
          ]"
        >
          <span>Require 2FA</span>
          <span>{{
            display.use2FA === null ? "..." : display.use2FA.toString()
          }}</span>
        </li>
        <li
          :class="[
            loading && 'loadingItem',
            !highlight?.includes('password') && 'decreaseVisibility',
          ]"
        >
          <span>Password</span>
          <span>{{ display.password?.replace(/./g, "*") || "..." }}</span>
        </li>
      </ul>
    </div>
    <div class="section buttons sbt" v-if="showView || showDefault">
      <ReactiveStateButtonEmpty
        v-if="showView"
        text="Details"
        state="default"
        @submit="$router.push(`/user/${user._id}/details`)"
      />
      <ReactiveStateButton
        v-if="showDefault"
        text="Set default"
        :state="defaultButtonState"
        @submit="handleSetDefault"
      />
    </div>
  </div>
</template>

<script setup>
import ReactiveStateButton from "@/components/buttons/ReactiveStateButton.vue";
import ReactiveStateButtonEmpty from "@/components/buttons/ReactiveStateButtonEmpty.vue";
import notificationStore from "@/store/notificationStore.js";
import profileStore from "@/store/profileStore.js";
import wrappedFetch from "@/assets/wrappedFetch.js";
import { defineProps, ref, computed } from "vue";
const { user, showView, showDefault, token, highlight } = defineProps([
  "user",
  "showView",
  "showDefault",
  "token",
  "highlight",
]);

const display = computed(() => {
  if (user) return user;
  return {
    username: "PLACEHOLDER",
    email: "PLACEHOLDER",
    profile: "https://assets.kanapka.eu/images/user.png",
    use2FA: null,
    birthday: null,
    gender: null,
    locale: null,
    language: null,
    password: null,
  };
});
const loading = computed(() => {
  if (!user) return true;
  return false;
});

const defaultButtonState = ref("default");

const handleSetDefault = () => {
  profileStore.setDefaultProfile(user._id);
};
</script>

<style scoped>
.userDetails {
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
.main .img {
  display: block;
  border-radius: 50%;
}
.main img {
  display: block;
  border-radius: 50%;
  width: 100%;
  aspect-ratio: 1;
  background-color: #eee;
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
.section p {
  color: #888;
  display: inline;
}
ul.keyVal li {
  display: flex;
  justify-content: space-between;
  list-style: none;
  color: #2d2d2d;
  margin-top: 2px;
}
.buttons {
  display: flex;
  gap: 10px;
  padding-top: 20px;
}
.decreaseVisibility {
  filter: blur(2px);
  opacity: 0.5;
}
</style>
