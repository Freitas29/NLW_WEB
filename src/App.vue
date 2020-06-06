<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>
<script lang="ts">
export default {};
</script>

<style>
:root {
  --primary-color: #34cb79;
  --title-color: #322153;
  --text-color: #6c6c80;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #f0f0f5;
  -webkit-font-smoothing: antialiased;
  color: var(--text-color);
}

body,
input,
button {
  font-family: Roboto, Arial, Helvetica, sans-serif;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  color: var(--title-color);
  font-family: Ubuntu;
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
  opacity: 0
}

</style>
