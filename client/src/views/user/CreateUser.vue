<template>
  <div class="container-standard wide">
    <div class="box tallBox">
      <div class="row">
        <h1>Create Account</h1>
      </div>
      <h2>Enter your details and submit to register.</h2>

      <div class="form">
        <EditUserForm @input="handleInput" :user="user" :errors="errors" />
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
        <UserDetailsPreview :user="user" />
        <ReactiveStateButtonEmpty
          v-if="createdAnAccount"
          state="default"
          text="Continue &rarr;"
          :ignoreEnter="true"
          @submit="handleContinue"
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
const router = useRouter();
import wrappedFetch from "@/assets/wrappedFetch";
import notificationStore from "@/store/notificationStore";

const createdAnAccount = ref(false);

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

const handleInput = (value, field) => {
  errors.value[field] = "";
  user.value[field] = value;
  if (field === "password" || field === "passwordRepeat") {
    if (user.value.password !== user.value.passwordRepeat) {
      errors.value.passwordRepeat = "Passwords are not the same";
    }
  }
};

const buttonText = ref("Create Account");
const buttonState = ref("default");

const handleSubmit = () => {
  if (user.value.password !== user.value.passwordRepeat) {
    errors.value.passwordRepeat = "Passwords are not the same";
    return;
  }

  const cleanUser = { ...user.value };
  delete cleanUser.passwordRepeat;

  buttonState.value = "loading";

  const createRequest = wrappedFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(cleanUser),
  });

  notificationStore.createNotif({
    type: "info",
    title: "Account Creation",
    details: "Account created successfully",
    duration: 10000,
    promise: {
      promise: createRequest,
      while: "Processing your request...",
    },
  });

  createRequest
    .then((data) => {
      buttonState.value = "success";
      createdAnAccount.value = true;

      console.log(data);
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

const handleContinue = () => {
  router.push("/authenticate");
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
  top: calc(var(--nav-height) + 20px);
  display: flex;
  flex-direction: column;
  gap: 40px;
}
</style>
