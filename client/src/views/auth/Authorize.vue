<template>
  <h1>Authorize</h1>
</template>

<script setup>
import wrappedFetch from "@/assets/wrappedFetch";
import { useRoute } from "vue-router";
const route = useRoute();
const query = route.query;

console.log(window.location.query);

const authorizationRequest = wrappedFetch(`/authorize`);
</script>
