<script setup lang="ts">
interface InfoItem {
  title: string;
  value: string;
  subText?: string;
}

defineProps<{
  items: InfoItem[];
}>();
</script>

<template>
  <div class="info-grid">
    <div v-for="item in items" :key="item.title" class="glass-card info-card">
      <div class="card-header">
        <span class="card-title">{{ item.title }}</span>
      </div>
      <div class="card-content">
        <p class="info-highlight">{{ item.value }}</p>
        <p v-if="item.subText" class="sub-text">{{ item.subText }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
}

.info-card {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.7;
}

.info-highlight {
  font-size: 1.4rem;
  font-weight: 600;
}

.sub-text {
  font-size: 0.9rem;
  opacity: 0.7;
}
</style>
