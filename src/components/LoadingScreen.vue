<script setup lang="ts">
// No logic needed for now
</script>

<template>
  <div class="loading-screen">
    <div style="font-size: 4rem; animation: bounce 2s infinite;">☁️</div>
    <p style="color: white; font-weight: bold; margin-top: 20px;">正在觀測雲的流動...</p>
  </div>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--ac-green);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
}
</style>
