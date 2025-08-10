<template>
  <div class="container-standard wide">
    <div class="box">
      <div class="row">
        <h1>{{ lS.localeKeys.UserDetails.title }}</h1>
      </div>
      <h2>{{ lS.localeKeys.UserDetails.description }}</h2>

      <div class="form">
        <div class="form">
          <ReactiveStateButtonEmpty
            state="default"
            :text="lS.localeKeys.Button.back"
            :ignoreEnter="true"
            @submit="$router.push(`/user/panel`)"
          />
        </div>
      </div>
    </div>

    <div class="box stickyRail">
      <div class="stickyCart">
        <UserDetailsPreview
          :user="profileStore.getProfileById($route.params._id)?.user"
        />

        <div
          class="actions"
          v-if="!profileStore.getParamProfile()?.isMissing2FA"
        >
          <ReactiveStateButton
            :class="loading && 'loadingItem'"
            state="default"
            :text="lS.localeKeys.UserDetails.buttons.edit"
            :ignoreEnter="true"
            @submit="$router.push(`/user/${$route.params._id}/edit`)"
          />
          <div class="buttons">
            <ReactiveStateButtonEmpty
              :class="loading && 'loadingItem'"
              :state="passwordResetState"
              :text="lS.localeKeys.UserDetails.buttons.reset"
              :ignoreEnter="true"
              @submit="handlePasswordReset($route.params._id)"
            />
            <BadReactiveStateButton
              :class="loading && 'loadingItem'"
              :state="deleteState"
              :text="lS.localeKeys.UserDetails.buttons.delete"
              :ignoreEnter="true"
              @submit="handleAccountDelete($route.params._id)"
            />
          </div>
          <ReactiveStateTransparentButton
            :class="loading && 'loadingItem'"
            :state="forgetState"
            :text="lS.localeKeys.UserDetails.buttons.forget"
            :ignoreEnter="true"
            @submit="handleAccountForget($route.params._id)"
          />
        </div>
        <div
          class="actions"
          v-if="profileStore.getParamProfile()?.isMissing2FA"
        >
          <ReactiveStateButton
            :class="loading && 'loadingItem'"
            state="default"
            :text="lS.localeKeys.UserDetails.buttons.signin2FA"
            :ignoreEnter="true"
            @submit="
              $router.push(
                `/authenticate/2fa?redirect=${router.currentRoute.value.fullPath}`
              )
            "
          />
          <ReactiveStateTransparentButton
            :class="loading && 'loadingItem'"
            :state="forgetState"
            :text="lS.localeKeys.UserDetails.buttons.forget"
            :ignoreEnter="true"
            @submit="handleAccountForget($route.params._id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import lS from "@/store/localeStore";
import UserDetailsPreview from "@/components/user/UserDetailsPreview.vue";
import ReactiveStateButton from "@/components/buttons/ReactiveStateButton.vue";
import ReactiveStateButtonEmpty from "@/components/buttons/ReactiveStateButtonEmpty.vue";
import ReactiveStateTransparentButton from "@/components/buttons/ReactiveStateTransparentButton.vue";
import BadReactiveStateButton from "@/components/buttons/BadReactiveStateButton.vue";
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import wrappedFetch from "@/assets/wrappedFetch.js";
import notificationStore from "@/store/notificationStore.js";
import profileStore from "@/store/profileStore.js";
import localeStore from "@/store/localeStore";

const loading = computed(() => {
  const profile = profileStore.getProfileById(route.params._id);
  if (!profile || !profile.user) return true;
  return false;
});

onMounted(() => {
  const profile = profileStore.getProfileById(route.params._id);
  if (!profile || !profile.user) {
    profileStore.getFullProfileList().catch((err) => {});
  }
});

const deleteState = ref("default");
const handleAccountDelete = (id) => {
  deleteState.value = "loading";

  const selectedProfile = profileStore.getProfileById(id);
  const deleteRequest = wrappedFetch(`/api/users/me`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${selectedProfile.token}`,
    },
  });

  notificationStore.createNotif({
    type: "info",
    title: lS.localeKeys.UserDetails.notificationDelete.title,
    details: lS.localeKeys.UserDetails.notificationDelete.details,
    duration: 10000,
    promise: {
      promise: deleteRequest,
      while: lS.localeKeys.UserDetails.notificationDelete.while,
    },
  });

  deleteRequest
    .then((data) => {
      profileStore
        .removeProfile(id)
        .then(() => {
          deleteState.value = "success";
        })
        .catch(() => {
          deleteState.value = "default";
        });
    })
    .catch((err) => {
      deleteState.value = "default";
    });
};

const forgetState = ref("default");
const handleAccountForget = (id) => {
  forgetState.value = "loading";
  profileStore
    .removeProfile(id)
    .then(() => {
      forgetState.value = "success";
    })
    .catch(() => {
      forgetState.value = "default";
    });
};

const passwordResetState = ref("default");
const handlePasswordReset = (id) => {
  passwordResetState.value = "loading";

  const selectedProfile = profileStore.getProfileById(id);
  const resetRequest = wrappedFetch(`/api/users/me/initiate-password-reset`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${selectedProfile.token}`,
    },
  });

  notificationStore.createNotif({
    type: "info",
    title: lS.localeKeys.UserDetails.notificationReset.title,
    details: lS.localeKeys.UserDetails.notificationReset.details,
    duration: 10000,
    promise: {
      promise: resetRequest,
      while: lS.localeKeys.UserDetails.notificationReset.while,
    },
  });

  resetRequest
    .then((data) => {
      passwordResetState.value = "success";
    })
    .catch((err) => {
      passwordResetState.value = "default";
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
  top: calc(var(--nav-height) + 30px);
  display: flex;
  flex-direction: column;
  gap: 40px;
}
.actions {
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.buttons {
  display: flex;
  gap: 10px;
  width: 100%;
}
</style>
