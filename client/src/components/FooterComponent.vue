<template>
  <footer>
    <div class="box">
      <div class="logo">
        <Logo />
      </div>

      <ul>
        <li>Home</li>
        <li>Services</li>
        <li>Products</li>
        <li>Contacts</li>
      </ul>
    </div>
  </footer>
</template>

<style scoped>
footer {
  width: 100%;
  padding: 10px 10px 100px 10px;
  border-top: 1px solid #ddd;
}
.box {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
</style>

<script setup>
import Logo from "@/components/LogoComponent.vue";
</script>
