<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  weather: string;
}>();

const backgroundClass = computed(() => {
  if (props.weather.includes("雨")) return "bg-rainy";
  if (props.weather.includes("晴")) return "bg-sunny";
  if (props.weather.includes("多雲") || props.weather.includes("陰")) return "bg-cloudy";
  if (props.weather.includes("雷")) return "bg-stormy";
  return "bg-default";
});

const isRainy = computed(() => props.weather.includes("雨"));
const isCloudy = computed(() => props.weather.includes("多雲") || props.weather.includes("陰"));
const isSunny = computed(() => props.weather.includes("晴"));
const isStormy = computed(() => props.weather.includes("雷"));
</script>

<template>
  <div class="weather-background" :class="backgroundClass">
    <!-- Sunny effects -->
    <div v-if="isSunny" class="sun-flare"></div>

    <!-- Cloudy effects -->
    <div v-if="isCloudy || isStormy" class="clouds">
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
    </div>

    <!-- Rainy effects -->
    <div v-if="isRainy" class="rain">
      <div v-for="i in 50" :key="i" class="drop" :style="{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 2}s`, animationDuration: `${0.5 + Math.random()}s` }"></div>
    </div>

    <!-- Stormy effects -->
    <div v-if="isStormy" class="lightning"></div>
    
    <div class="overlay"></div>
  </div>
</template>

<style scoped>
.weather-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: background 1s ease-in-out;
  overflow: hidden;
}

.bg-sunny { background: linear-gradient(to bottom, #4facfe 0%, #00f2fe 100%); }
.bg-cloudy { background: linear-gradient(to bottom, #bdc3c7 0%, #2c3e50 100%); }
.bg-rainy { background: linear-gradient(to bottom, #616161 0%, #9bc5c3 100%); }
.bg-stormy { background: linear-gradient(to bottom, #1e1e2f 0%, #4b4b7a 100%); }
.bg-default { background: linear-gradient(to bottom, #2980b9 0%, #6dd5fa 100%, #ffffff 100%); }

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
}

/* Rain Effect */
.rain {
  position: absolute;
  width: 100%;
  height: 100%;
}
.drop {
  position: absolute;
  width: 2px;
  height: 15px;
  background: rgba(255, 255, 255, 0.4);
  top: -20px;
  animation: fall linear infinite;
}
@keyframes fall {
  to { transform: translateY(100vh); }
}

/* Cloud Effect */
.clouds {
  position: absolute;
  width: 100%;
  height: 100%;
}
.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.3);
  filter: blur(40px);
  border-radius: 50%;
}
.cloud-1 { width: 400px; height: 200px; top: 10%; left: -10%; animation: cloud-drift 60s infinite linear; }
.cloud-2 { width: 500px; height: 250px; top: 30%; right: -20%; animation: cloud-drift 80s infinite linear reverse; }
.cloud-3 { width: 300px; height: 150px; bottom: 20%; left: 20%; animation: cloud-drift 50s infinite linear; }

/* Lightning Effect */
.lightning {
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  opacity: 0;
  animation: flash 5s infinite;
}
@keyframes flash {
  0%, 90%, 100% { opacity: 0; }
  92% { opacity: 0.6; }
  94% { opacity: 0; }
  96% { opacity: 0.8; }
  98% { opacity: 0; }
}

/* Sun Flare */
.sun-flare {
  position: absolute;
  top: 10%;
  right: 10%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,204,0,0.4) 50%, transparent 70%);
  filter: blur(20px);
  animation: pulse 4s infinite ease-in-out;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
}
</style>
