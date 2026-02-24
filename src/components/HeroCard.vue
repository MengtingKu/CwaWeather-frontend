<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import type { Forecast } from '../composables/useWeather';
import WeatherDetails from './WeatherDetails.vue';

interface Location {
  name: string;
  townships?: string[];
}

const props = defineProps<{
  forecast: Forecast;
  getWeatherIcon: (weather: string) => string;
  getTimePeriod: (startTime: string) => string;
  city: string;
  isSticky?: boolean;
  locations: Location[];
  selectedCity: string;
  onCityChange: (city: string, county?: string) => void;
}>();

const isDropdownOpen = ref(false);
const activeCounty = ref<Location | null>(null);

// Initialize activeCounty if current selected city is a township or a county with optional townships
onMounted(() => {
  const currentLoc = props.locations.find(l => 
    l.name === props.selectedCity || (l.townships && l.townships.includes(props.selectedCity))
  );
  if (currentLoc && currentLoc.townships) {
    activeCounty.value = currentLoc;
  }
});

const avgTemp = computed(() => Math.round((parseInt(props.forecast.maxTemp) + parseInt(props.forecast.minTemp)) / 2));

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectLocation = (loc: Location) => {
  props.onCityChange(loc.name);
  if (loc.townships && loc.townships.length > 0) {
    activeCounty.value = loc;
  } else {
    activeCounty.value = null;
  }
  isDropdownOpen.value = false;
};

const selectTownship = (township: string) => {
  if (activeCounty.value) {
    props.onCityChange(township, activeCounty.value.name);
  }
};

// Close dropdown when clicking outside or scrolling
onMounted(() => {
  const handleOutsideClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const wrapper = document.querySelector('.city-selector-wrapper');
    if (wrapper && !wrapper.contains(target)) {
      isDropdownOpen.value = false;
    }
  };

  const handleScroll = () => {
    if (isDropdownOpen.value) {
      isDropdownOpen.value = false;
    }
  };

  window.addEventListener('click', handleOutsideClick);
  // Use capture to catch scroll events from the scrollable main container
  window.addEventListener('scroll', handleScroll, true);

  onUnmounted(() => {
    window.removeEventListener('click', handleOutsideClick);
    window.removeEventListener('scroll', handleScroll, true);
  });
});
</script>

<template>
  <div class="hero-section" :class="{ 'is-sticky': isSticky }">
    <!-- Placeholder to prevent layout shift and overlapping -->
    <div class="header-placeholder"></div>
    
    <div class="sticky-header">
      <div class="city-selector-wrapper" @click.stop="toggleDropdown">
        <div class="city-selector-heading">
          {{ activeCounty ? activeCounty.name : selectedCity }}
        </div>
        <svg 
          class="chevron-icon" 
          :class="{ 'is-rotated': isDropdownOpen }"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M12 16.06l-5.3-5.3a1 1 0 0 1 1.42-1.42L12 13.25l3.88-3.91a1 1 0 1 1 1.42 1.42l-5.3 5.3z"/>
        </svg>

        <Transition name="fade-glass">
          <div v-if="isDropdownOpen" class="liquid-glass-dropdown">
            <div 
              v-for="loc in locations" 
              :key="loc.name" 
              class="dropdown-item"
              :class="{ 'is-active': activeCounty ? loc.name === activeCounty.name : loc.name === selectedCity }"
              @click.stop="selectLocation(loc)"
            >
              {{ loc.name }}
            </div>
          </div>
        </Transition>
      </div>
      <div class="main-info">
        <div class="temp-display">{{ avgTemp }}<span class="text-sm">°C</span></div>
        <div class="sticky-divider">|</div>
        <p class="condition-text">{{ forecast.weather }}</p>
      </div>
      <div class="temp-range">最高: {{ forecast.maxTemp }}  最低: {{ forecast.minTemp }}</div>
    </div>
    <!-- Liquid Glass Horizontal Sub-menu -->
    <div v-if="activeCounty && activeCounty.townships" class="liquid-glass-navbar" :class="{ 'is-sticky-fixed': isSticky }">
      <div class="nav-scroll-wrapper">
        <div 
          class="nav-item"
          :class="{ 'is-active': activeCounty && selectedCity === activeCounty.name }"
          @click="activeCounty && selectLocation(activeCounty)"
        >
          <div class="nav-content-wrapper">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/>
            </svg>
            <span class="nav-text">全區</span>
          </div>
          <div v-if="activeCounty && selectedCity === activeCounty.name" class="nav-active-indicator"></div>
        </div>

        <div 
          v-for="t in activeCounty.townships" 
          :key="t" 
          class="nav-item"
          :class="{ 'is-active': t === selectedCity }"
          @click="selectTownship(t)"
        >
          <span class="nav-text">{{ t }}</span>
          <div v-if="t === selectedCity" class="nav-active-indicator"></div>
        </div>
      </div>
    </div>

</div>
</template>

<style scoped>
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
}

.header-placeholder {
  height: 240px; 
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.is-sticky .header-placeholder {
  height: 90px;
}

.sticky-header {
  position: absolute;
  top: 140px;
  transform: translateY(-50%);
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  text-shadow: 0 2px 12px rgba(0,0,0,0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 200;
}

/* 滾動時的 Sticky 狀態 */
.is-sticky .sticky-header {
  position: fixed;
  top: 0;
  transform: translateY(0);
  padding: calc(env(safe-area-inset-top, 10px) + 5px) 0 10px;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  width: 100%;
}

.city-selector-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px; /* 縮小間距 */
  cursor: pointer;
  user-select: none;
}

.city-selector-heading {
  font-size: 1.4rem;
  font-weight: 300;
  color: white;
  text-align: center;
  font-family: inherit;
  transition: all 0.4s ease;
}

.chevron-icon {
  width: 24px;
  height: 24px;
  opacity: 0.8;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 4px;
}

.chevron-icon.is-rotated {
  transform: rotate(180deg);
}


/* Liquid Glass Navbar Styling */
.liquid-glass-navbar {
  width: 100%;
  margin: 12px auto 5px;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px; /* Pill shape */
  padding: 2px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 50;
  overflow: hidden;
  transition: all 0.4s ease;
}

.liquid-glass-navbar.is-sticky-fixed {
  position: fixed;
  top: 90px; /* 位置微調 */
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 30px);
  max-width: 470px;
  z-index: 101;
  background: rgba(0, 0, 0, 0.4); /* 與 header 一致 */
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  margin-top: 0;
}

.nav-scroll-wrapper {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  gap: 2px;
  padding: 0 8px;
  align-items: center;
}

.nav-scroll-wrapper::-webkit-scrollbar {
  display: none;
}

.nav-content-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-icon {
  opacity: 0.9;
}

.nav-item {
  padding: 6px 14px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.9rem;
  font-weight: 500;
  position: relative;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.nav-item.is-active {
  color: white;
}

.nav-text {
  padding-bottom: 2px;
}

.nav-active-indicator {
  position: absolute;
  bottom: -3px; /* 補償父容器的 2px padding，使其完全貼齊底邊 */
  left: 12px;
  right: 12px;
  height: 6px;
  background: #3fb2ff;
  border-radius: 4px 4px 0 0; /* 頂部圓角 */
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { opacity: 0; transform: scaleX(0); }
  to { opacity: 1; transform: scaleX(1); }
}

.liquid-glass-dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 12px;
  min-width: 180px;
  background: rgba(20, 20, 20, 0.85); /* 提高不透明度以增強可讀性 */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.dropdown-item {
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  text-align: center;
  transition: all 0.2s ease;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  min-width: 180px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.dropdown-item.is-active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
  color: #fff;
}

/* Transition Animation */
.fade-glass-enter-active,
.fade-glass-leave-active {
  transition: all 0.3s ease;
}

.fade-glass-enter-from,
.fade-glass-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

.is-sticky .city-selector-heading {
  font-size: 1.6rem;
  font-weight: 400;
}

.is-sticky .chevron-icon {
  width: 18px;
  height: 18px;
}

.city-selector-heading option {
  background: #2c3e50;
  color: white;
  font-size: 1rem;
}

.main-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.4s ease;
}

.is-sticky .main-info {
  flex-direction: row;
  justify-content: center;
  gap: 12px;
  margin-top: 5px;
}

.temp-display {
  font-size: 4rem;
  font-weight: 100;
  line-height: 1.5;
  letter-spacing: 1px;
  transition: all 0.4s ease;
}

.is-sticky .temp-display {
  font-size: 1.3rem; /* 與 condition-text 大小一致 */
  font-weight: 500;
}

.sticky-divider {
  display: none;
  opacity: 0.6;
}

.is-sticky .sticky-divider {
  display: block;
  font-size: 1.3rem;
}

.condition-text {
  font-size: 1.4rem;
  font-weight: 500;
  opacity: 0.9;
  transition: all 0.4s ease;
}

.is-sticky .condition-text {
  font-size: 1.3rem;
  font-weight: 500;
  opacity: 1;
}

.temp-range {
  font-size: 1.1rem;
  font-weight: 500;
  margin-top: 10px;
  transition: all 0.3s ease;
}

.is-sticky .temp-range {
  opacity: 0;
  visibility: hidden;
  height: 0;
  margin: 0;
}
</style>
