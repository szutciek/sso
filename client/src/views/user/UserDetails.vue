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
            :class="loading && 'loadingItem'"
            state="default"
            text="Edit Account"
            :ignoreEnter="true"
            @submit="$router.push(`/user/${$route.params._id}/edit`)"
          />
          <div class="buttons">
            <ReactiveStateButtonEmpty
              :class="loading && 'loadingItem'"
              :state="forgetState"
              text="Forget Account"
              :ignoreEnter="true"
              @submit="handleAccountForget($route.params._id)"
            />
            <BadReactiveStateButton
              :class="loading && 'loadingItem'"
              :state="deleteState"
              text="Delete Account"
              :ignoreEnter="true"
              @submit="handleAccountDelete($route.params._id)"
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
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import wrappedFetch from "@/assets/wrappedFetch.js";
import notificationStore from "@/store/notificationStore.js";
import profileStore from "@/store/profileStore.js";

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
    title: "Deleting Account",
    details: `Account has been deleted`,
    duration: 10000,
    promise: {
      promise: deleteRequest,
      while: "Deleting your account...",
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
