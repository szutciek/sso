<template>
  <div class="container-standard mW1200">
    <div class="box wide">
      <div class="row">
        <h1>Authorize App</h1>
      </div>
      <h2>Please wait while we process your request.</h2>
    </div>
  </div>
</template>

<script setup>
import wrappedFetch from "@/assets/wrappedFetch.js";
import notificationStore from "@/store/notificationStore.js";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();

const query = { ...route.query };
delete query.source;
const queryString = new URLSearchParams(query).toString();

const authorizationRequest = wrappedFetch(
  `/authorize?${queryString}&source=app`,
  { method: "GET" }
);

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
