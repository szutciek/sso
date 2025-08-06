<template>
  <div class="container-standard wide">
    <div class="box">
      <div class="row">
        <h1>Create Account</h1>
      </div>
      <h2>Enter your details and submit to register.</h2>

      <div class="form">
        <EditUserForm @input="handleInput" :user="user" />
        <ReactiveStateButton :state="'default'" :text="`Create Account`" />
      </div>
    </div>
    <div class="box stickyRail">
      <UserDetailsPreview class="stickyCart" :user="user" />
    </div>
  </div>
</template>

<script setup>
import EditUserForm from "@/components/user/EditUserForm.vue";
import UserDetailsPreview from "@/components/user/UserDetailsPreview.vue";
import ReactiveStateButton from "@/components/buttons/ReactiveStateButton.vue";
import { ref } from "vue";

const user = ref({
  username: null,
  email: null,
  profile: "https://assets.kanapka.eu/images/user.png",
  use2FA: null,
  birthday: null,
  gender: null,
  locale: null,
  language: null,
  password: null,
  passwordRepeat: null,
});

const handleInput = (value, field) => {
  user.value[field] = value;
};
</script>

<style scoped>
.stickyRail {
  height: 100%;
}
.stickyCart {
  position: sticky;
  top: calc(var(--nav-height) + 20px);
}
</style>
