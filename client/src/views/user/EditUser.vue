<template>
  <div class="container-standard wide">
    <div class="box tallBox">
      <div class="row">
        <h1>{{ lS.localeKeys.EditUser.title }}</h1>
      </div>
      <h2>{{ lS.localeKeys.EditUser.description }}</h2>

      <EditUserForm
        @input="handleInput"
        :user="user"
        :errors="errors"
        :blockEmailInput="true"
        :blockPasswordInput="true"
      />
      <div class="form">
        <ReactiveStateButton
          :state="buttonStateSubmit"
          :text="lS.localeKeys.EditUser.buttons.submit"
          :ignoreEnter="true"
          @submit="handleSubmit"
        />
        <ReactiveStateButtonEmpty
          :state="buttonStateClear"
          :text="lS.localeKeys.EditUser.buttons.clear"
          :ignoreEnter="true"
          @submit="clearChanges"
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
          :text="lS.localeKeys.Button.back"
          :ignoreEnter="true"
          @submit="$router.push(`/user/${$route.params._id}/details`)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import lS from "@/store/localeStore";
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

const buttonStateSubmit = ref("default");
const buttonStateClear = ref("default");

const handleSubmit = () => {
  const selectedProfile = profileStore.getProfileById(route.params._id);
  if (!selectedProfile) return;

  const cleanUser = {};
  Object.entries(user.value).forEach(([key, value]) => {
    if (value !== null) cleanUser[key] = value;
  });

  buttonState.value = "loading";

  const updateRequest = wrappedFetch(`/api/users/me`, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${selectedProfile.token}`,
    },
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
        clearChanges();
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

const clearChanges = () => {
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
