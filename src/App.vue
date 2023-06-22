<template>
  <div class="app">
    <HomeFolder />
    <HomeContent />
  </div>
</template>

<script setup lang="ts">
import HomeFolder from "./components/HomeFolder/src/HomeFolder.vue";
</script>

<style scoped lang="scss">
.app {
  display: flex;

  width: 100vw;
  height: 100vh;

  overflow-y: auto;
}
</style>
