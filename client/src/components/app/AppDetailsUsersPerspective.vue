<template>
  <div class="container sb">
    <div class="form">
      <div class="appDetails section">
        <img :src="app.app.icon" :alt="app.name" />
        <div>
          <h2>{{ app.app.name }}</h2>
          <p>
            {{ lS.localeKeys.AppDetails.byAuthor }}
            {{ app.app.developer.user.username }}
          </p>
        </div>
      </div>

      <div :class="['section', 'status', app.status]">
        <p>
          {{
            app.status === "trusted"
              ? lS.localeKeys.AppDetails[`Trusted`]
              : lS.localeKeys.AppDetails[`Trust Revoked`]
          }}
        </p>
      </div>

      <div class="section permissions">
        <div>
          <p>
            {{
              app.status === "trusted"
                ? lS.localeKeys.AppDetails.infoShared
                : lS.localeKeys.AppDetails.infoRequested
            }}:
          </p>
          <ul>
            <AppSharedItem
              v-for="item of app.app.scope"
              :item="{ field: item, label: lS.localeKeys.Fields[item] }"
            />
          </ul>
        </div>
      </div>

      <div class="section action" v-if="app.status === 'trusted'">
        <ReactiveStateButton
          :text="lS.localeKeys.AppDetails.buttonRevoke"
          :state="buttonState"
          @submit="handleRevoke"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import AppSharedItem from "@/components/app/AppSharedItem.vue";
import ReactiveStateButton from "@/components/buttons/ReactiveStateButton.vue";
import wrappedFetch from "@/assets/wrappedFetch.js";
import { ref, defineProps } from "vue";
import profileStore from "@/store/profileStore";
import notificationStore from "@/store/notificationStore";
import lS from "@/store/localeStore.js";
const { app, profile } = defineProps(["app", "profile"]);

const buttonState = ref("default");

const handleRevoke = () => {
  buttonState.value = "loading";

  const revokeRequest = wrappedFetch(`/api/apps/trust/${app.app._id}`, {
    method: "DELETE",
    headers: {
      authorization: `Bearer ${profile.token}`,
    },
  });

  notificationStore.createNotif({
    type: "info",
    title: "Revoking Trust",
    details: `Revoked trust in "${app.app.name}"`,
    duration: 10000,
    promise: {
      promise: revokeRequest,
      while: "Revoking trust...",
    },
  });

  revokeRequest
    .then((data) => {
      buttonState.value = "success";

      profileStore.getFullProfileList().catch((err) => {
        console.warn(err);
      });
    })
    .catch((err) => {
      buttonState.value = "default";
    });
};
</script>

<style scoped>
.section {
  padding: 0 20px;
}
.appDetails {
  display: grid;
  align-items: center;
  grid-template-columns: 60px auto;
  gap: 20px;
}
.appDetails img {
  width: 100%;
  aspect-ratio: 1;
}
.appDetails h2 {
  font-weight: 600;
}
.status {
  margin: 8px 0 4px 0;
}
.status p {
  display: inline;
  padding: 2px 8px;
  background-color: #2d2d2d;
  color: #fff;
}
.status.trusted p {
  background-color: #4fd43e;
}
.status.revoked p {
  background-color: #ff2727;
}
</style>
