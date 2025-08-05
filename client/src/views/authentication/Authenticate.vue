<template>
  <div class="container mW1200">
    <div class="box">
      <div class="title">
        <div class="top">
          <h1>Sign in</h1>
        </div>
        <h2>Use the form below to sign in with your Kanapka SSO account.</h2>
      </div>

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
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};
</script>

<style scoped>
.container {
  flex: 1;
  width: 100%;
}
.box {
  margin: 30px 0;
  max-width: 320px;
}

.title .top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.title h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
}
.title .top img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #efefef;
}
.title h2 {
  font-size: 0.9rem;
  font-weight: 400;
  color: #535353;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 11px;
  margin: 20px 0;
}
</style>
