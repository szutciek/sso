<template>
  <div class="form">
    <div class="form">
      <LabelledTextInput
        :config="usernameConfig"
        @input="handleInput"
        :error="errors.username"
      />
      <LabelledTextInput
        :config="emailConfig"
        @input="handleInput"
        :error="errors.email"
      />
    </div>

    <div class="form">
      <LabelledDateInput
        :config="birthdayConfig"
        @input="handleInput"
        :error="errors.birthday"
      />
      <LabelledEnumInput
        :config="genderConfig"
        :selected="user.gender"
        @input="handleInput"
        :error="errors.gender"
      />
    </div>

    <div class="form">
      <LabelledDropdownInput
        :config="localeConfig"
        :selected="user.locale"
        @input="handleInput"
        :error="errors.locale"
      />
      <LabelledEnumInput
        :config="languageConfig"
        :selected="user.language"
        @input="handleInput"
        :error="errors.language"
      />
    </div>

    <div class="form">
      <LabelledEnumInput
        :config="use2FAConfig"
        :selected="user.use2FA"
        @input="handleInput"
        :error="errors.use2FA"
      />
    </div>

    <div class="form">
      <LabelledTextInput
        :config="passwordConfig"
        @input="handleInput"
        :error="errors.password"
      />
      <LabelledTextInput
        :config="repeatPasswordConfig"
        @input="handleInput"
        :error="errors.passwordRepeat"
      />
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";
const { user, errors } = defineProps(["user", "errors"]);
const emit = defineEmits(["input"]);
const handleInput = (value, field) => {
  emit("input", value, field);
};

import LabelledTextInput from "../inputs/LabelledTextInput.vue";
import LabelledDropdownInput from "../inputs/LabelledDropdownInput.vue";
import LabelledEnumInput from "../inputs/LabelledEnumInput.vue";
import LabelledDateInput from "../inputs/LabelledDateInput.vue";

const usernameConfig = {
  field: "username",
  type: "",
  label: "Username",
};
const emailConfig = {
  field: "email",
  type: "email",
  label: "Email",
};
const birthdayConfig = {
  field: "birthday",
  label: "Birthday",
};
const genderConfig = {
  field: "gender",
  enum: ["male", "female", "other"],
  label: "Gender",
};
const localeConfig = {
  field: "locale",
  values: ["en", "pl", "nl"],
  label: "Locale",
};
const languageConfig = {
  field: "language",
  enum: ["en"],
  label: "Language",
};
const use2FAConfig = {
  field: "use2FA",
  enum: [false, true],
  label: "Require 2FA",
};
const passwordConfig = {
  field: "password",
  type: "password",
  label: "Password",
};
const repeatPasswordConfig = {
  field: "passwordRepeat",
  type: "password",
  label: "Repeat Password",
};
</script>

<style scoped></style>
