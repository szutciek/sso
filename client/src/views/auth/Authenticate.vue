<template>
  <div class="container-standard">
    <div class="box">
      <div class="row">
        <h1>Sign in</h1>
      </div>
      <h2>Use the form below to sign in with your Kanapka SSO account.</h2>

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
          :text="buttonText"
          @submit="handleSubmit()"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LabelledTextInput from "@/components/inputs/LabelledTextInput.vue";
import ReactiveStateButton from "@/components/buttons/ReactiveStateButton.vue";
import profileStore from "@/store/profileStore";
import { useRouter, useRoute } from "vue-router";
import wrappedFetch from "@/assets/wrappedFetch";
import notificationStore from "@/store/notificationStore";
const router = useRouter();
const route = useRoute();

const emailInputConfig = {
  field: "email",
  type: "email",
  label: "Email address",
};
const passwordInputConfig = {
  field: "password",
  type: "password",
  label: "Password",
};

const emailInputError = ref("");
const passwordInputError = ref("");

const buttonState = ref("default");
const buttonText = ref("Submit");

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
      title: "Authentication",
      details: "You have been successfully authenticated",
      duration: 5000,
      promise: {
        promise: loginRequest,
        while: "Checking your credentials...",
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
</script>

<style scoped></style>
