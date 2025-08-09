<template>
  <div class="userDetails sb">
    <div class="section main sbb">
      <div :class="computeClasses().filter((c) => c === 'loadingItem')">
        <img
          :src="display.profile"
          :alt="display.username"
          :class="computeClasses('profile').filter((c) => c !== 'loadingItem')"
        />
      </div>
      <div>
        <h2 :class="computeClasses('username')">
          {{ display.username || "..." }}
        </h2>
        <p :class="computeClasses('email')">
          {{ display.email || "..." }}
        </p>
      </div>
    </div>
    <div class="section">
      <p :class="computeClasses().filter((c) => c === 'loadingItem')">
        {{ lS.localeKeys.UserDetailsPreview.labels.personal }}
      </p>
      <ul class="keyVal">
        <li :class="computeClasses('birthday')">
          <span>{{ lS.localeKeys.Fields.birthday }}</span>
          <span>{{
            display.birthday
              ? new Date(display.birthday)?.toLocaleDateString()
              : "..."
          }}</span>
        </li>
        <li :class="computeClasses('gender')">
          <span>{{ lS.localeKeys.Fields.gender }}</span
          ><span>{{ display.gender || "..." }}</span>
        </li>
      </ul>
    </div>
    <div class="section">
      <p :class="computeClasses().filter((c) => c === 'loadingItem')">
        {{ lS.localeKeys.UserDetailsPreview.labels.location }}
      </p>
      <ul class="keyVal">
        <li :class="computeClasses('locale')">
          <span>{{ lS.localeKeys.Fields.locale }}</span>
          <span>{{ display.locale || "..." }}</span>
        </li>
        <li :class="computeClasses('language')">
          <span>{{ lS.localeKeys.Fields.language }}</span>
          <span>{{ display.language || "..." }}</span>
        </li>
      </ul>
    </div>
    <div class="section">
      <p :class="computeClasses().filter((c) => c === 'loadingItem')">
        {{ lS.localeKeys.UserDetailsPreview.labels.security }}
      </p>
      <ul class="keyVal">
        <li :class="computeClasses('use2FA')">
          <span>{{ lS.localeKeys.Fields.use2FA }}</span>
          <span>{{
            display.use2FA === null ? "..." : display.use2FA.toString()
          }}</span>
        </li>
        <li :class="computeClasses('password')">
          <span>{{ lS.localeKeys.Fields.password }}</span>
          <span>{{ display.password?.replace(/./g, "*") || "..." }}</span>
        </li>
      </ul>
    </div>
    <div class="section buttons sbt" v-if="showView || showDefault">
      <ReactiveStateButtonEmpty
        v-if="showView"
        :text="lS.localeKeys.UserDetailsPreview.buttons.details"
        state="default"
        @submit="$router.push(`/user/${user._id}/details`)"
      />
      <ReactiveStateButton
        v-if="showDefault"
        :text="lS.localeKeys.UserDetailsPreview.buttons.default"
        :state="defaultButtonState"
        @submit="handleSetDefault"
      />
    </div>
  </div>
</template>

<script setup>
import lS from "@/store/localeStore";
import ReactiveStateButton from "@/components/buttons/ReactiveStateButton.vue";
import ReactiveStateButtonEmpty from "@/components/buttons/ReactiveStateButtonEmpty.vue";
import notificationStore from "@/store/notificationStore.js";
import profileStore from "@/store/profileStore.js";
import wrappedFetch from "@/assets/wrappedFetch.js";
import { defineProps, ref, computed } from "vue";
const { user, showView, showDefault, token, highlight, blurOther } =
  defineProps([
    "user",
    "showView",
    "showDefault",
    "token",
    "highlight",
    "blurOther",
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
const computeClasses = (field) => {
  const list = [];
  if (!user) {
    list.push("loadingItem");
  }
  if (blurOther && !blurOther.includes(field)) {
    list.push("blur");
  }
  if (highlight && highlight.includes(field)) {
    list.push("highlight");
  }
  return list;
};

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
  align-items: stretch;
  gap: 10px;
  padding-top: 20px;
}
.blur {
  filter: blur(2px);
  opacity: 0.5;
}
.highlight {
  background-color: #2d2d2d !important;
  color: #fff !important;
  margin: -2px -8px;
  padding: 2px 8px;
}
img.highlight {
  border: 4px solid #2d2d2d !important;
  background-color: #eee !important;
  margin: 0;
  padding: 0;
}
</style>
