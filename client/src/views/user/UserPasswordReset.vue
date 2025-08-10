<template>
  <div class="container-standard">
    <div class="box">
      <div class="row">
        <h1>{{ lS.localeKeys.UserPasswordReset.title }}</h1>
      </div>
      <h2>{{ lS.localeKeys.UserPasswordReset.description }}</h2>

      <div class="form">
        <LabelledTextInput
          @input="password = $event"
          :config="passwordInputConfig"
          :error="passwordInputError"
        />
        <LabelledTextInput
          @input="passwordRepeat = $event"
          :config="passwordRepeatInputConfig"
          :error="passwordRepeatInputError"
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
import { ref, computed } from "vue";
import LabelledTextInput from "@/components/inputs/LabelledTextInput.vue";
import ReactiveStateButton from "@/components/buttons/ReactiveStateButton.vue";
import { useRouter, useRoute } from "vue-router";
import wrappedFetch from "@/assets/wrappedFetch";
import notificationStore from "@/store/notificationStore";
const router = useRouter();
const route = useRoute();

const passwordInputConfig = computed(() => ({
  field: "password",
  type: "password",
  label: lS.localeKeys.Fields.password,
}));
const passwordRepeatInputConfig = computed(() => ({
  field: "passwordRepeat",
  type: "password",
  label: lS.localeKeys.Fields.passwordRepeat,
}));

const passwordInputError = ref("");
const passwordRepeatInputError = ref("");

const buttonState = ref("default");

const password = ref("");
const passwordRepeat = ref("");

const handleSubmit = () => {
  try {
    if (password.value !== passwordRepeat.value) {
      passwordRepeatInputError.value =
        lS.localeKeys.UserPasswordReset.passwordsNotSame;
      return;
    }

    buttonState.value = "loading";

    const resetRequest = wrappedFetch(`/api/users/complete-password-reset`, {
      method: "POST",
      body: JSON.stringify({
        code: route.query.code,
        email: route.query.email,
        password: password.value,
      }),
    });

    notificationStore.createNotif({
      type: "info",
      title: lS.localeKeys.UserPasswordReset.notification.title,
      details: lS.localeKeys.UserPasswordReset.notification.details,
      duration: 5000,
      promise: {
        promise: resetRequest,
        while: lS.localeKeys.UserPasswordReset.notification.while,
      },
    });

    resetRequest
      .then((data) => {
        buttonState.value = "success";

        if (route.query.redirect) {
          return router.push(route.query.redirect);
        }

        router.push(`/authenticate`);
      })
      .catch((err) => {
        if (err.details) {
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
