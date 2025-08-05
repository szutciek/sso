<template>
  <div class="container-standard mW1200">
    <div class="box">
      <div class="row">
        <h1>2FA Code</h1>
      </div>
      <h2>Enter the 2 factor authentication code from your inbox.</h2>

      <div class="form">
        <LabelledTextInput
          @input="code = $event"
          :config="codeInputConfig"
          :error="codeInputError"
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
import notificationStore from "@/store/notificationStore.js";
import profileStore from "@/store/profileStore";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const redirect = route.query.redirect;

const codeInputConfig = {
  field: "code",
  type: "",
  label: "2FA Code",
};

const codeInputError = ref("");

const buttonState = ref("default");
const buttonText = ref("Submit");

const code = ref("");

const handleSubmit = async () => {
  try {
    buttonState.value = "loading";

    const response = await fetch("/authenticate/2fa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.details) {
        codeInputError.value = data.details?.code;
        return;
      }
      buttonState.value = "default";
    }

    buttonState.value = "success";
    profileStore.addProfile({
      token: data.token,
      _id: data.details._id,
      use2FA: data.details.use2FA,
      used2FA: data.details.used2FA,
    });

    const queryPresent = redirect != null;
    const encodedQuery = encodeURIComponent(`?redirect=${redirect}`);
    if (data.details.use2FA === true && data.details.used2FA !== true) {
      router.push(`/en/authenticate/2fa${queryPresent ? encodedQuery : ""}`);
    } else {
      router.push(`${queryPresent ? encodedQuery : "/en"}`);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

import wrappedFetch from "@/assets/wrappedFetch.js";

const emailRequest = wrappedFetch("/authenticate/2fa/request-code", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    code: code.value,
  }),
});

notificationStore.createNotif({
  type: "info",
  title: "Sending 2FA Code",
  details: "We are sending your 2FA code to your email",
  duration: 5000,
  promise: {
    promise: emailRequest,
    while: "Sending email...",
  },
});
</script>

<style scoped></style>
