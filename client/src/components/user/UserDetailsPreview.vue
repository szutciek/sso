<template>
  <div class="userDetails sb">
    <div class="section main sbb">
      <img :src="user.profile" :alt="user.username" />
      <div>
        <h2>{{ user.username || "..." }}</h2>
        <p>{{ user.email || "..." }}</p>
      </div>
    </div>
    <div class="section">
      <p>Personal Details</p>
      <ul class="keyVal">
        <li>
          <span>Birthday</span>
          <span>{{
            user.birthday
              ? new Date(user.birthday)?.toLocaleDateString()
              : "..."
          }}</span>
        </li>
        <li>
          <span>Gender</span><span>{{ user.gender || "..." }}</span>
        </li>
      </ul>
    </div>
    <div class="section">
      <p>Locale & Language</p>
      <ul class="keyVal">
        <li>
          <span>Locale</span>
          <span>{{ user.locale || "..." }}</span>
        </li>
        <li>
          <span>Language</span>
          <span>{{ user.language || "..." }}</span>
        </li>
      </ul>
    </div>
    <div class="section">
      <p>Security Settings</p>
      <ul class="keyVal">
        <li>
          <span>Require 2FA</span>
          <span>{{
            user.use2FA === null ? "..." : user.use2FA.toString()
          }}</span>
        </li>
        <li>
          <span>Password</span>
          <span>{{ user.password?.replace(/./g, "*") || "..." }}</span>
        </li>
      </ul>
    </div>
    <div class="section buttons sbt" v-if="showEdit || showDefault">
      <ReactiveStateButtonEmpty v-if="showEdit" text="Edit" state="default" />
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
import wrappedFetch from "@/assets/wrappedFetch.js";
import { defineProps, ref } from "vue";
const { user, showEdit, showDefault } = defineProps([
  "user",
  "showEdit",
  "showDefault",
]);

const defaultButtonState = ref("default");

const handleSetDefault = () => {
  defaultButtonState.value = "loading";

  const defaultRequest = wrappedFetch("/authenticate/set-default-token", {
    method: "POST",
    body: JSON.stringify({
      token: "123",
    }),
  });

  notificationStore.createNotif({
    type: "info",
    title: "Setting Default Profile",
    details: "Default pofile has been successfully set",
    duration: 10000,
    promise: {
      promise: defaultRequest,
      while: "Changing your default profile...",
    },
  });

  defaultRequest
    .then((data) => {
      defaultButtonState.value = "success";
      console.log(data);

      profileStore.addDefaultProfile({
        token: data.token,
      });
    })
    .catch((err) => {
      defaultButtonState.value = "default";
    });
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
.main img {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
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
}
ul.keyVal li {
  display: flex;
  justify-content: space-between;
  list-style: none;
  color: #2d2d2d;
}
.buttons {
  display: flex;
  gap: 10px;
  padding-top: 20px;
}
</style>
