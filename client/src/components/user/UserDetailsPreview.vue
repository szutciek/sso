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
          <span>{{ user.birthday?.toLocaleDateString() || "..." }}</span>
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
  </div>
</template>

<script setup>
import { defineProps } from "vue";
const { user } = defineProps(["user"]);
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
  font-weight: 600;
}
ul.keyVal li {
  display: flex;
  justify-content: space-between;
  list-style: none;
}
</style>
