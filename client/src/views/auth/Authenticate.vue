<template>
  <div class="container-standard">
    <div class="box">
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
</script>

<style scoped></style>
