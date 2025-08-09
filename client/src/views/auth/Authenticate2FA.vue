<template>
  <div class="container-standard">
    <div class="box">
      <div class="row">
        <h1>{{ lS.localeKeys.Authenticate2FA.title }}</h1>
      </div>
      <h2>
        {{ lS.localeKeys.Authenticate2FA.description[0] }}
        <a v-if="emailUrl" :href="emailUrl" target="_blank">{{
          lS.localeKeys.Authenticate2FA.description[1]
        }}</a
        ><span v-if="!emailUrl">{{
          lS.localeKeys.Authenticate2FA.description[1]
        }}</span
        >.
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
import notificationStore from "@/store/notificationStore.js";
import profileStore from "@/store/profileStore";
import { useRouter, useRoute } from "vue-router";
import wrappedFetch from "@/assets/wrappedFetch.js";
const router = useRouter();
const route = useRoute();

const codeInputConfig = {
  field: "code",
  type: "",
  label: lS.localeKeys.Fields.code2FA,
};

const codeInputError = ref("");

const buttonState = ref("default");

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
      title: lS.localeKeys.Authenticate2FA.notificationSubmit.title,
      details: lS.localeKeys.Authenticate2FA.notificationSubmit.details,
      duration: 5000,
      promise: {
        promise: loginRequest,
        while: lS.localeKeys.Authenticate2FA.notificationSubmit.while,
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

        router.push(`/user/panel`);
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
  title: lS.localeKeys.Authenticate2FA.notificationRequest.title,
  details: lS.localeKeys.Authenticate2FA.notificationRequest.details,
  duration: 5000,
  promise: {
    promise: emailRequest,
    while: lS.localeKeys.Authenticate2FA.notificationRequest.while,
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
