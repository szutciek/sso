<template>
  <div class="form">
    <div class="form">
      <LabelledTextInput :config="usernameConfig" @input="handleInput" />
      <LabelledTextInput :config="emailConfig" @input="handleInput" />
    </div>

    <div class="form">
      <LabelledDateInput :config="birthdayConfig" @input="handleInput" />
      <LabelledEnumInput
        :config="genderConfig"
        :selected="user.gender"
        @input="handleInput"
      />
    </div>

    <div class="form">
      <LabelledDropdownInput :config="localeConfig" @input="handleInput" />
      <LabelledEnumInput
        :config="languageConfig"
        :selected="user.language"
        @input="handleInput"
      />
    </div>

    <div class="form">
      <LabelledEnumInput
        :config="use2FAConfig"
        :selected="user.use2FA"
        @input="handleInput"
      />
      <LabelledTextInput :config="passwordConfig" @input="handleInput" />
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from "vue";
const { user } = defineProps(["user"]);
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
  enum: ["male", "female", "ermm"],
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
</script>

<style scoped></style>
