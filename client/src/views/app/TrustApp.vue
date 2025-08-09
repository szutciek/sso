<template>
  <div class="container-standard wide">
    <div class="box">
      <div class="row">
        <h1>{{ lS.localeKeys.TrustApp.title }}</h1>
      </div>
      <h2>{{ lS.localeKeys.TrustApp.description }}</h2>

      <div class="form" v-if="app">
        <AppDetailsBriefPreview :app="app" class="sbt sbb" />

        <div class="permissions">
          <p>{{ lS.localeKeys.TrustApp.required }}:</p>
          <ul>
            <AppSharedItem
              v-for="item of app.scope"
              :item="{ field: item, label: lS.localeKeys.Fields[item] }"
            />
          </ul>
        </div>

        <ReactiveStateButton
          :state="buttonState"
          :text="buttonText"
          @submit="handleSubmit"
        />
      </div>
    </div>
    <div class="box">
      <UserDetailsPreview
        :user="profileStore.getDefaultProfile()?.user"
        :highlight="app?.scope"
      />
    </div>
  </div>
</template>

<script setup>
import lS from "@/store/localeStore";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { ref } from "vue";
import wrappedFetch from "@/assets/wrappedFetch.js";
import AppDetailsBriefPreview from "@/components/app/AppDetailsBriefPreview.vue";
import AppSharedItem from "@/components/app/AppSharedItem.vue";
import ReactiveStateButton from "@/components/buttons/ReactiveStateButton.vue";
import UserDetailsPreview from "@/components/user/UserDetailsPreview.vue";
import profileStore from "@/store/profileStore.js";
profileStore.getFullProfileList().catch((err) => {
  console.warn(err);
});

const app = ref(null);

const buttonState = ref("loading");
const buttonText = ref(`...`);

const appInfoRequest = wrappedFetch(`/api/apps/${route.params._id}`, {
  method: "GET",
});

appInfoRequest
  .then((data) => {
    app.value = data;
    buttonState.value = "default";
    buttonText.value = `${lS.localeKeys.TrustApp.trust} ${app.value.name}`;
  })
  .catch((err) => {
    console.warn(err);
  });

const handleSubmit = async () => {
  buttonState.value = "loading";

  const response = await fetch(`/api/apps/trust/${app.value._id}`, {
    method: "POST",
  });
  const data = await response.json();

  if (!response.ok) {
    console.warn(data);
    buttonState.value = "default";
    return;
  }

  buttonState.value = "success";

  setTimeout(() => {
    router.push(route.query.redirect);
  }, 1000);
};
</script>

<style scoped>
.trust {
  padding-top: 20px;
}
.permissions {
  padding: 0 10px;
}
</style>
