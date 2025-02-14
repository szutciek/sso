<template>
  <div @click="$router.push('/')">
    <p>Kanapka</p>
    <h1>SSO</h1>
  </div>
</template>

<style scoped>
div {
  background-color: var(--main-color-l);
  width: min-content;
  height: min-content;
  padding: 8px 6px 4px 8px;

  user-select: none !important;
  -moz-user-select: none !important;
  cursor: pointer;
}

p,
h1 {
  color: #fff;
  margin: 0;
  padding: 0;
  line-height: 1;
}

p {
  font-size: 14px;
  font-weight: 300;
}

h1 {
  font-size: 40px;
  font-weight: 700;
}
</style>
