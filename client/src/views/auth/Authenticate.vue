<template>
  <div class="container-standard mW1200">
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
const router = useRouter();
const route = useRoute();
const redirect = route.query.redirect;

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

const handleSubmit = async () => {
  try {
    buttonState.value = "loading";

    const response = await fetch("/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.details) {
        emailInputError.value = data.details?.email;
        passwordInputError.value = data.details?.password;
      }
      buttonState.value = "default";
      return;
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
</script>

<style scoped></style>
