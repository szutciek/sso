<template>
  <div class="container-standard wide">
    <div class="box">
      <div class="row">
        <h1>Account Details</h1>
      </div>
      <h2>View details and manage the account.</h2>

      <div class="form">
        <div class="buttons">
          <ReactiveStateButtonEmpty
            state="default"
            text="Back to Panel"
            :ignoreEnter="true"
            @submit="$router.push('/user/panel')"
          />
        </div>
      </div>
    </div>

    <div class="box stickyRail">
      <div class="stickyCart">
        <UserDetailsPreview
          :user="profileStore.getProfileById($route.params._id)?.user"
        />

        <div class="actions">
          <ReactiveStateButton
            state="default"
            text="Edit Account"
            :ignoreEnter="true"
            @submit="$router.push(`/user/${$route.params._id}/edit`)"
          />
          <div class="buttons">
            <ReactiveStateButtonEmpty
              state="default"
              text="Forget Account"
              :ignoreEnter="true"
              @submit="handleAccountForget"
            />
            <BadReactiveStateButton
              state="default"
              text="Delete Account"
              :ignoreEnter="true"
              @submit="handleAccountDelete"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UserDetailsPreview from "@/components/user/UserDetailsPreview.vue";
import ReactiveStateButton from "@/components/buttons/ReactiveStateButton.vue";
import ReactiveStateButtonEmpty from "@/components/buttons/ReactiveStateButtonEmpty.vue";
import BadReactiveStateButton from "@/components/buttons/BadReactiveStateButton.vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import wrappedFetch from "@/assets/wrappedFetch.js";
import notificationStore from "@/store/notificationStore.js";
import profileStore from "@/store/profileStore.js";

onMounted(() => {
  if (!profileStore.getProfileById(route.params._id).user) {
    profileStore.getFullProfileList().catch((err) => {});
  }
});

const user = ref({
  username: null,
  email: null,
  profile: "https://assets.kanapka.eu/images/user.png",
  use2FA: null,
  birthday: null,
  gender: null,
  locale: null,
  language: null,
  password: null,
  passwordRepeat: null,
});

const errors = ref({
  username: null,
  email: null,
  profile: null,
  use2FA: null,
  birthday: null,
  gender: null,
  locale: null,
  language: null,
  password: null,
  passwordRepeat: null,
});

const handleInput = (value, field) => {
  errors.value[field] = "";
  user.value[field] = value;
  if (field === "password" || field === "passwordRepeat") {
    if (user.value.password !== user.value.passwordRepeat) {
      errors.value.passwordRepeat = "Passwords are not the same";
    }
  }
};

const buttonText = ref("Submit Changes");
const buttonState = ref("default");

const handleSubmit = () => {
  if (user.value.password !== user.value.passwordRepeat) {
    errors.value.passwordRepeat = "Passwords are not the same";
    return;
  }

  const cleanUser = { ...user.value };
  delete cleanUser.passwordRepeat;

  buttonState.value = "loading";

  const createRequest = wrappedFetch("/api/users", {
    method: "POST",
    body: JSON.stringify(cleanUser),
  });

  notificationStore.createNotif({
    type: "info",
    title: "Account Creation",
    details: "Account created successfully",
    duration: 10000,
    promise: {
      promise: createRequest,
      while: "Processing your request...",
    },
  });

  createRequest
    .then((data) => {
      buttonState.value = "success";

      console.log(data);
    })
    .catch((err) => {
      if (err.details) {
        Object.entries(err.details).forEach(([key, value]) => {
          errors.value[key] = value;
        });
      }
      buttonState.value = "default";
    });
};
</script>

<style scoped>
.tallBox {
  margin-bottom: 30vh;
}
.stickyRail {
  flex: 1;
}
.stickyCart {
  position: sticky;
  top: calc(var(--nav-height) + 20px);
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.buttons {
  display: flex;
  gap: 10px;
  padding-top: 10px;
}
</style>
