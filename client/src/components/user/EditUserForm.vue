<template>
  <div class="form">
    <div class="form">
      <LabelledTextInput
        :config="usernameConfig"
        @input="handleInput"
        :error="errors.username"
      />
      <LabelledTextInput
        v-if="!blockEmailInput"
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

    <div class="form" v-if="!blockPasswordInput">
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
import { defineEmits, defineProps, computed } from "vue";
const { user, errors, blockEmailInput, blockPasswordInput } = defineProps([
  "user",
  "errors",
  "blockEmailInput",
  "blockPasswordInput",
]);
const emit = defineEmits(["input"]);
const handleInput = (value, field) => {
  emit("input", value, field);
};

import lS from "@/store/localeStore";

import LabelledTextInput from "../inputs/LabelledTextInput.vue";
import LabelledDropdownInput from "../inputs/LabelledDropdownInput.vue";
import LabelledEnumInput from "../inputs/LabelledEnumInput.vue";
import LabelledDateInput from "../inputs/LabelledDateInput.vue";

const usernameConfig = computed(() => ({
  field: "username",
  type: "text",
  label: lS.localeKeys.Fields.username,
}));
const emailConfig = computed(() => ({
  field: "email",
  type: "email",
  label: lS.localeKeys.Fields.email,
}));
const birthdayConfig = computed(() => ({
  field: "birthday",
  label: lS.localeKeys.Fields.birthday,
}));
const genderConfig = computed(() => ({
  field: "gender",
  enum: ["male", "female", "other"],
  label: lS.localeKeys.Fields.gender,
}));
const localeConfig = computed(() => ({
  field: "locale",
  values: ["en", "pl", "nl"],
  label: lS.localeKeys.Fields.locale,
}));
const languageConfig = computed(() => ({
  field: "language",
  enum: ["en"],
  label: lS.localeKeys.Fields.language,
}));
const use2FAConfig = computed(() => ({
  field: "use2FA",
  enum: [false, true],
  label: lS.localeKeys.Fields.use2FA,
}));
const passwordConfig = computed(() => ({
  field: "password",
  type: "password",
  label: lS.localeKeys.Fields.password,
}));
const repeatPasswordConfig = computed(() => ({
  field: "passwordRepeat",
  type: "password",
  label: lS.localeKeys.Fields.passwordRepeat,
}));
</script>

<style scoped></style>
