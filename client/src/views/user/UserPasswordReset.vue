<template>
  <div class="container-standard">
    <div class="box">
      <div class="row">
        <h1>{{ t.title }}</h1>
      </div>
      <h2>{{ t.description }}</h2>

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
          :text="localeStore.localeKeys.Button.submit"
          @submit="handleSubmit()"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import localeStore from "@/store/localeStore";
const t = localeStore.localeKeys.UserPasswordReset;
import { ref, computed } from "vue";
import LabelledTextInput from "@/components/inputs/LabelledTextInput.vue";
import ReactiveStateButton from "@/components/buttons/ReactiveStateButton.vue";
import profileStore from "@/store/profileStore";
import { useRouter, useRoute } from "vue-router";
import wrappedFetch from "@/assets/wrappedFetch";
import notificationStore from "@/store/notificationStore";
const router = useRouter();
const route = useRoute();

const passwordInputConfig = computed(() => ({
  field: "password",
  type: "password",
  label: localeStore.localeKeys.Fields.password,
}));
const passwordRepeatInputConfig = computed(() => ({
  field: "passwordRepeat",
  type: "password",
  label: localeStore.localeKeys.Fields.passwordRepeat,
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
        localeStore.localeKeys.UserPasswordReset.passwordsNotSame;
      return;
    }

    buttonState.value = "loading";

    const selectedProfile = profileStore.getParamProfile();
    const resetRequest = wrappedFetch(`/api/users/me/complete-password-reset`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${selectedProfile.token}`,
      },
      body: JSON.stringify({
        code: route.query.code,
        password: password.value,
      }),
    });

    notificationStore.createNotif({
      type: "info",
      title: t.notification.title,
      details: t.notification.details,
      duration: 5000,
      promise: {
        promise: resetRequest,
        while: t.notification.while,
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
