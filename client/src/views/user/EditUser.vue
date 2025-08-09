<template>
  <div class="container-standard wide">
    <div class="box tallBox">
      <div class="row">
        <h1>Edit Account</h1>
      </div>
      <h2>Make changes and submit to update.</h2>

      <div class="form">
        <EditUserForm
          @input="handleInput"
          :user="user"
          :errors="errors"
          :blockEmailInput="true"
          :blockPasswordInput="true"
        />
        <ReactiveStateButton
          :state="buttonState"
          :text="buttonText"
          :ignoreEnter="true"
          @submit="handleSubmit"
        />
      </div>
    </div>

    <div class="box stickyRail">
      <div class="stickyCart">
        <UserDetailsPreview
          :user="computeChangedUser()"
          :highlight="computeChangedFields()"
        />
        <ReactiveStateButtonEmpty
          state="default"
          text="Back"
          :ignoreEnter="true"
          @submit="$router.push(`/user/${$route.params._id}/details`)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import EditUserForm from "@/components/user/EditUserForm.vue";
import UserDetailsPreview from "@/components/user/UserDetailsPreview.vue";
import ReactiveStateButton from "@/components/buttons/ReactiveStateButton.vue";
import ReactiveStateButtonEmpty from "@/components/buttons/ReactiveStateButtonEmpty.vue";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import wrappedFetch from "@/assets/wrappedFetch";
import notificationStore from "@/store/notificationStore";
import profileStore from "@/store/profileStore.js";
profileStore.getFullProfileList().catch((err) => {
  console.warn(err);
});

const user = ref({
  username: null,
  email: null,
  profile: null,
  use2FA: null,
  birthday: null,
  gender: null,
  locale: null,
  language: null,
  password: null,
  passwordRepeat: null,
});

const errors = ref({
  username: null,
  email: null,
  profile: null,
  use2FA: null,
  birthday: null,
  gender: null,
  locale: null,
  language: null,
  password: null,
  passwordRepeat: null,
});

const computeChangedUser = () => {
  const profile = profileStore.getProfileById(route.params._id);
  if (!profile.user) return null;
  const obj = { ...profile.user };
  Object.entries(user.value).forEach(([key, value]) => {
    if (value !== null) obj[key] = value;
  });
  return obj;
};
const computeChangedFields = () => {
  return Object.entries(user.value).map(([key, value]) => {
    if (value !== null) return key;
  });
};

const handleInput = (value, field) => {
  errors.value[field] = "";
  user.value[field] = value;
  if (field === "password" || field === "passwordRepeat") {
    if (user.value.password !== user.value.passwordRepeat) {
      errors.value.passwordRepeat = "Passwords are not the same";
    }
  }
};

const buttonText = ref("Submit Changes");
const buttonState = ref("default");

const handleSubmit = () => {
  if (user.value.password !== user.value.passwordRepeat) {
    errors.value.passwordRepeat = "Passwords are not the same";
    return;
  }

  const cleanUser = {};
  Object.entries(user.value).forEach(([key, value]) => {
    if (value !== null) cleanUser[key] = value;
  });

  buttonState.value = "loading";

  const updateRequest = wrappedFetch("/api/users/me", {
    method: "PUT",
    body: JSON.stringify(cleanUser),
  });

  notificationStore.createNotif({
    type: "info",
    title: "Account Edition",
    details: "Account updated successfully",
    duration: 5000,
    promise: {
      promise: updateRequest,
      while: "Processing your request...",
    },
  });

  updateRequest
    .then((data) => {
      buttonState.value = "success";

      profileStore.getFullProfileList().catch((err) => {
        console.warn(err);
      });

      setTimeout(() => {
        buttonState.value = "default";
        user.value = {
          username: null,
          email: null,
          profile: null,
          use2FA: null,
          birthday: null,
          gender: null,
          locale: null,
          language: null,
          password: null,
          passwordRepeat: null,
        };
      }, 3000);
    })
    .catch((err) => {
      if (err.details) {
        Object.entries(err.details).forEach(([key, value]) => {
          errors.value[key] = value;
        });
      }
      buttonState.value = "default";
    });
};
</script>

<style scoped>
.tallBox {
  margin-bottom: 30vh;
}
.stickyRail {
  flex: 1;
}
.stickyCart {
  position: sticky;
  top: calc(var(--nav-height) + 30px);
  display: flex;
  flex-direction: column;
  gap: 40px;
}
</style>
