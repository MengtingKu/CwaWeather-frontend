<script setup lang="ts">
import { computed } from 'vue';
import type { Forecast } from '../composables/useWeather';

const props = defineProps<{
  forecast: Forecast;
  getWeatherIcon: (weather: string) => string;
  getTimePeriod: (startTime: string) => string;
}>();

const dayName = computed(() => {
  const date = new Date(props.forecast.startTime);
  const hour = date.getHours();
  const periodStr = (hour >= 6 && hour < 18) ? "白天" : "晚上";
  
  const today = new Date();
  let baseName = "";
  
  if (date.toDateString() === today.toDateString()) {
    baseName = "今天";
  } else {
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      baseName = "明天";
    } else {
      const days = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
      baseName = days[date.getDay()];
    }
  }
  
  return `${baseName} ${periodStr}`;
});
</script>

<template>
  <div class="forecast-row">
    <div class="day-label">{{ dayName }}</div>
    
    <div class="weather-col">
      <div class="weather-icon">{{ getWeatherIcon(forecast.weather) }}</div>
      <div class="rain-chance" v-if="parseInt(forecast.rain) > 0">
        {{ forecast.rain }}%
      </div>
    </div>
    
    <div class="temp-col low">{{ forecast.minTemp }}°</div>
    
    <div class="range-bar-container">
      <div class="range-bar-bg">
        <div class="range-bar-fill"></div>
      </div>
    </div>
    
    <div class="temp-col high">{{ forecast.maxTemp }}°</div>
  </div>
</template>

<style scoped>
.forecast-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: 15px;
  width: 100%;
}

.forecast-row:last-child {
  border-bottom: none;
}

.day-label {
  width: 50px;
  font-size: 1.1rem;
  font-weight: 500;
  color: white;
}

.weather-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
}

.weather-icon {
  font-size: 1.4rem;
}

.rain-chance {
  font-size: 0.7rem;
  color: #00d2ff;
  font-weight: 700;
  margin-top: -2px;
}

.temp-col {
  width: 35px;
  font-size: 1.1rem;
  font-weight: 500;
  color: white;
  text-align: right;
}

.temp-col.low {
  opacity: 0.6;
}

.range-bar-container {
  flex: 1;
  padding: 0 5px;
}

.range-bar-bg {
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.range-bar-fill {
  position: absolute;
  left: 20%;
  right: 20%;
  top: 0;
  bottom: 0;
  background: linear-gradient(to right, #ffcc00, #ff5e3a);
  border-radius: 10px;
}

.high {
  text-align: left;
}
</style>
