<template>
  <div class="container-standard">
    <div class="box">
      <div class="row">
        <h1>2FA Code</h1>
      </div>
      <h2>
        Enter the 2 factor authentication code from
        <a v-if="emailUrl" :href="emailUrl" target="_blank">your inbox</a
        ><span v-if="!emailUrl">your inbox</span>.
      </h2>

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
import wrappedFetch from "@/assets/wrappedFetch.js";
const router = useRouter();
const route = useRoute();

const codeInputConfig = {
  field: "code",
  type: "",
  label: "2FA Code",
};

const codeInputError = ref("");

const buttonState = ref("default");
const buttonText = ref("Submit");

const code = ref("");

const handleSubmit = () => {
  try {
    buttonState.value = "loading";

    const loginRequest = wrappedFetch("/authenticate/2fa", {
      method: "POST",
      body: JSON.stringify({
        code: code.value,
      }),
    });

    notificationStore.createNotif({
      type: "info",
      title: "Authentication",
      details: "You have been successfully authenticated",
      duration: 10000,
      promise: {
        promise: loginRequest,
        while: "Checking the provided 2FA code...",
      },
    });

    loginRequest
      .then((data) => {
        buttonState.value = "success";
        profileStore.addProfile({
          token: data.token,
          _id: data.details._id,
          use2FA: data.details.use2FA,
          used2FA: data.details.used2FA,
        });

        if (route.query.redirect) {
          return router.push(route.query.redirect);
        }

        router.push(`/en`);
      })
      .catch((err) => {
        if (err.details) {
          codeInputError.value = err.details?.code;
        }
        buttonState.value = "default";
      });
  } catch (error) {
    buttonState.value = "default";
    console.error("Error:", error.message);
  }
};

const emailRequest = wrappedFetch("/authenticate/2fa/request-code", {
  method: "POST",
  body: JSON.stringify({
    code: code.value,
  }),
});

notificationStore.createNotif({
  type: "info",
  title: "2FA Code Delivery",
  details: "2FA code has been delivered to you inbox",
  duration: 10000,
  promise: {
    promise: emailRequest,
    while: "Sending 2FA code to your email...",
  },
});

const emailUrl = ref(null);
wrappedFetch("/api/users/me/email-provider")
  .then((data) => {
    emailUrl.value = data.provider;
  })
  .catch((err) => {
    console.warn(`Email Provider Fetch Failed: ${err.message}`);
  });
</script>

<style scoped>
a {
  text-decoration: underline;
}
</style>
