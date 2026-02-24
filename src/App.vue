<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWeather } from './composables/useWeather';
import HeroCard from './components/HeroCard.vue';
import ForecastCard from './components/ForecastCard.vue';
import WeatherDetails from './components/WeatherDetails.vue';
import LoadingScreen from './components/LoadingScreen.vue';
import WeatherBackground from './components/WeatherBackground.vue';

const locations = [
  { name: "目前位置" },
  { name: "臺北市" },
  { name: "苗栗縣", townships: ["頭份市"] },
  { name: "臺中市", townships: ["南區", "南屯區", "西屯區", "西區", "北區", "北屯區", "烏日區"] },
  { name: "彰化縣", townships: ["彰化市", "花壇鄉"] },
  { name: "高雄市" }
];

const { 
  forecasts, 
  city,
  selectedCity,
  isLoading, 
  updateDate, 
  getWeatherIcon, 
  getAdvice, 
  getTimePeriod,
  initWeather
} = useWeather(locations);

const handleCityChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  initWeather(target.value);
};

const weatherDetailsData = computed(() => {
  const f = forecasts.value?.[0];
  if (!f) return [];
  
  const advice = getAdvice(f.rain, f.maxTemp);
  
  return [
    { 
      title: '🧥 穿搭建議', 
      value: advice.clothText, 
      subText: `${f.minApparentTemp || '--'} ~ ${f.maxApparentTemp || '--'}` 
    },
    { 
      title: '☂️ 降雨預報', 
      value: advice.rainText, 
      subText: `降雨機率 ${f.rain}` 
    },
    { title: '💧 平均濕度', value: f.humidity || '--' },
    { title: '💨 平均風速', value: f.windSpeed || '--' }
  ];
});

const isSticky = ref(false);

const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  isSticky.value = target.scrollTop > 30;
};

</script>

<template>
  <LoadingScreen v-if="isLoading" />
  
  <div v-else class="app-container flex flex-col h-screen overflow-hidden" :class="{ 'header-is-sticky': isSticky }">
    <WeatherBackground :weather="forecasts?.[0]?.weather || ''" />
    <header class="px-[15px] shrink-0 z-50">
      <HeroCard
        v-if="forecasts.length > 0"
        :forecast="forecasts[0]"
        :city="city"
        :locations="locations"
        :selectedCity="selectedCity"
        :onCityChange="(city: string, county?: string) => { initWeather(city, county); }"
        :isSticky="isSticky"
        :getWeatherIcon="getWeatherIcon"
        :getTimePeriod="getTimePeriod"
      />
    </header>
    <main class="content-wrapper flex-1 overflow-y-auto pt-4 " @scroll="handleScroll">
      <div v-if="forecasts?.[0]?.humidity" class="weather-details-section">
        <h3 class="section-title">
          <span class="icon">📊</span> 詳細資訊
        </h3>
        <WeatherDetails :items="weatherDetailsData" />
      </div>

      <div class="glass-card forecast-section">
        <h3 class="section-title">
          <span class="icon">📅</span> 多日預報
        </h3>
        <div class="forecast-list">
          <ForecastCard 
            v-for="(forecast, index) in (forecasts?.slice(1) || [])" 
            :key="index"
            :forecast="forecast"
            :getWeatherIcon="getWeatherIcon"
            :getTimePeriod="getTimePeriod"
          />
        </div>
      </div>
      
      <div class="footer pb-10">
        最後更新: {{ updateDate }}
      </div>
    </main>
  </div>
</template>

<style>
.app-container {
  width: 100%;
}

.content-wrapper {
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.forecast-section {
  padding: 15px;
}

.section-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.forecast-list {
  display: flex;
  flex-direction: column;
  padding: 0 5px;
}

.footer {
  text-align: center;
  font-size: 0.8rem;
  opacity: 0.5;
  margin-top: 20px;
}

</style>
