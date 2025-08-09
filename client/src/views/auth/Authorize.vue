<template>
  <div class="container-standard wide">
    <div class="box">
      <div class="row">
        <h1>
          {{ lS.localeKeys.Authorize.title }}
        </h1>
      </div>
      <h2>{{ lS.localeKeys.Authorize.description }}</h2>
    </div>
  </div>
</template>

<script setup>
import lS from "@/store/localeStore";
import wrappedFetch from "@/assets/wrappedFetch.js";
import notificationStore from "@/store/notificationStore.js";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();

const queryString = new URLSearchParams(route.query).toString();
const authorizationRequest = wrappedFetch(`/authorize?${queryString}`, {
  method: "GET",
});

notificationStore.createNotif({
  type: "info",
  title: "Sending Authorization Request",
  details: "We are processing your request",
  duration: 5000,
  promise: {
    promise: authorizationRequest,
    while: "Processing request...",
  },
});

authorizationRequest
  .then((data) => {
    // WARNING: can result in changing host
    window.location = data.redirect;
  })
  .catch((err) => {
    if (err?.details?.redirect) {
      router.push(err.details.redirect);
    } else {
      console.warn(err);
    }
  });
</script>

<style scoped></style>
