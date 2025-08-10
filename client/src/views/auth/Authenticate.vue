<template>
  <div class="container-standard">
    <div class="box flexCol">
      <div class="row">
        <h1>{{ lS.localeKeys.Authenticate.title }}</h1>
      </div>
      <h2>{{ lS.localeKeys.Authenticate.description }}</h2>

      <div class="form">
        <LabelledTextInput
          @input="email = $event"
          :config="emailInputConfig"
          :error="emailInputError"
        />
        <LabelledTextInput
          @input="password = $event"
          :config="passwordInputConfig"
          :error="passwordInputError"
        />
      </div>

      <div class="submit">
        <ReactiveStateButton
          :state="buttonState"
          :text="lS.localeKeys.Button.submit"
          @submit="handleSubmit()"
        />
      </div>

      <div class="otherMethods">
        <ReactiveStateTransparentButton
          :ignoreEnter="true"
          :state="resetButtonState"
          :text="lS.localeKeys.Authenticate.buttons.reset"
          @submit="handlePasswordResetRequest()"
        />
        <ReactiveStateTransparentButton
          :ignoreEnter="true"
          state="default"
          :text="`${lS.localeKeys.Authenticate.buttons.create} &nearr;`"
          @submit="handleGoCreate()"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import lS from "@/store/localeStore";
import { ref } from "vue";
import LabelledTextInput from "@/components/inputs/LabelledTextInput.vue";
import ReactiveStateButton from "@/components/buttons/ReactiveStateButton.vue";
import profileStore from "@/store/profileStore";
import { useRouter, useRoute } from "vue-router";
import wrappedFetch from "@/assets/wrappedFetch";
import notificationStore from "@/store/notificationStore";
import ReactiveStateTransparentButton from "@/components/buttons/ReactiveStateTransparentButton.vue";
const router = useRouter();
const route = useRoute();

const emailInputConfig = {
  field: "email",
  type: "email",
  label: lS.localeKeys.Fields.email,
};
const passwordInputConfig = {
  field: "password",
  type: "password",
  label: lS.localeKeys.Fields.password,
};

const emailInputError = ref("");
const passwordInputError = ref("");

const buttonState = ref("default");

const email = ref("");
const password = ref("");

const handleSubmit = () => {
  try {
    buttonState.value = "loading";

    const loginRequest = wrappedFetch("/authenticate", {
      method: "POST",
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    notificationStore.createNotif({
      type: "info",
      title: lS.localeKeys.Authenticate.notification.title,
      details: lS.localeKeys.Authenticate.notification.details,
      duration: 5000,
      promise: {
        promise: loginRequest,
        while: lS.localeKeys.Authenticate.notification.while,
      },
    });

    loginRequest
      .then((data) => {
        buttonState.value = "success";

        profileStore.addDefaultProfile({
          token: data.token,
        });

        if (route.query.redirect) {
          return router.push(route.query.redirect);
        }

        if (data.details.use2FA === true && data.details.used2FA !== true) {
          router.push(`/en/authenticate/2fa`);
        } else {
          router.push(`/user/panel`);
        }
      })
      .catch((err) => {
        if (err.details) {
          emailInputError.value = err.details?.email;
          passwordInputError.value = err.details?.password;
        }
        buttonState.value = "default";
      });
  } catch (error) {
    buttonState.value = "default";
    console.error("Error:", error.message);
  }
};

const resetButtonState = ref("default");
const handlePasswordResetRequest = () => {
  resetButtonState.value = "loading";

  const resetRequest = wrappedFetch(`/api/users/initiate-password-reset`, {
    method: "POST",
    body: JSON.stringify({
      email: email.value,
    }),
  });

  notificationStore.createNotif({
    type: "info",
    title: lS.localeKeys.UserDetails.notificationReset.title,
    details: lS.localeKeys.UserDetails.notificationReset.details,
    duration: 10000,
    promise: {
      promise: resetRequest,
      while: lS.localeKeys.UserDetails.notificationReset.while,
    },
  });

  resetRequest
    .then((data) => {
      resetButtonState.value = "success";
    })
    .catch((err) => {
      if (err.details) {
        passwordInputError.value = err.details?.password;
      }
      resetButtonState.value = "default";
    });
};

const handleGoCreate = () => {
  window.open("/register", "_blank");
};
</script>

<style scoped>
.flexCol {
  display: flex;
  flex-direction: column;
}
.otherMethods {
  margin-top: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
