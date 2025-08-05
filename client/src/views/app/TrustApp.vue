<template>
  <div class="container-standard">
    <div class="box wide">
      <div class="row">
        <h1>Trust App</h1>
      </div>
      <h2>Review the details of the app and required info.</h2>

      <div class="form" v-if="app">
        <AppDetailsPreview :app="app" class="bt bb" />

        <div>
          <p>Info required by app:</p>
          <ul>
            <AppSharedItem v-for="item of app.scope" :item="item" />
          </ul>
        </div>

        <ReactiveStateButton
          :state="buttonState"
          :text="buttonText"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
import { ref } from "vue";
import wrappedFetch from "@/assets/wrappedFetch.js";
import AppDetailsPreview from "@/components/app/AppDetailsPreview.vue";
import AppSharedItem from "@/components/app/AppSharedItem.vue";
import ReactiveStateButton from "@/components/buttons/ReactiveStateButton.vue";

const app = ref(null);

const buttonState = ref("default");
const buttonText = ref(`Trust App`);

const appInfoRequest = wrappedFetch(`/api/apps/${route.params._id}`, {
  method: "GET",
});

appInfoRequest
  .then((data) => {
    app.value = data;
    buttonText.value = `Trust ${app.value.name}`;
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
.bt {
  border-top: 1px solid #ddd;
}
.bb {
  border-bottom: 1px solid #ddd;
}
.trust {
  padding-top: 20px;
}
</style>
