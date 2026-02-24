import { ref, onMounted } from 'vue'

export interface Forecast {
  startTime: string;
  endTime: string;
  weather: string;
  maxTemp: string;
  minTemp: string;
  rain: string;
  humidity?: string;
  maxApparentTemp?: string;
  minApparentTemp?: string;
  windSpeed?: string;
}

export interface WeatherData {
  success: boolean;
  data: {
    city: string;
    forecasts: Forecast[];
  };
}

export function useWeather(locations: { name: string; townships?: string[] }[]) {
  const BASE_URL = "https://kuku-cwaweather-backend.zeabur.app/api/weather";
  const forecasts = ref<Forecast[]>([]);
  const isLoading = ref(true);
  const updateDate = ref("");
  const city = ref("");
  const selectedCity = ref("目前位置"); // New tracking for UI dropdown

  const getWeatherIcon = (weather: string) => {
    if (!weather) return "🌤️";
    if (weather.includes("晴")) return "☀️";
    if (weather.includes("多雲")) return "⛅";
    if (weather.includes("陰")) return "☁️";
    if (weather.includes("雨")) return "🌧️";
    if (weather.includes("雷")) return "⛈️";
    return "🌤️";
  };

  const getAdvice = (rainProb: string, maxTemp: string) => {
    let rainIcon = "🌂";
    let rainText = "不用帶傘";
    if (parseInt(rainProb) > 30) {
      rainIcon = "☂️";
      rainText = "記得帶傘！";
    }

    let clothIcon = "👕";
    let clothText = "舒適穿搭";
    if (parseInt(maxTemp) >= 28) {
      clothIcon = "🎽";
      clothText = "短袖出發";
    } else if (parseInt(maxTemp) <= 20) {
      clothIcon = "🧥";
      clothText = "加件外套";
    }

    return { rainIcon, rainText, clothIcon, clothText };
  };

  const getTimePeriod = (startTime: string) => {
    const hour = new Date(startTime).getHours();
    if (hour >= 5 && hour < 11) return "早晨";
    if (hour >= 11 && hour < 14) return "中午";
    if (hour >= 14 && hour < 18) return "下午";
    if (hour >= 18 && hour < 23) return "晚上";
    return "深夜";
  };

  const fetchWeather = async (cityName?: string, countyName?: string, lat?: number, lon?: number) => {
    try {
      isLoading.value = true;
      
      let url = `${BASE_URL}?`;
      
      if (cityName && cityName !== "目前位置") {
        url += `city=${encodeURIComponent(cityName)}&`;
      }
      
      if (countyName) {
        url += `county=${encodeURIComponent(countyName)}&`;
      } else if (cityName && cityName !== "目前位置" && !countyName) {
        // 如果只有傳入像 "彰化縣" 這樣的名稱且沒有 countyName，
        // 根據使用者需求，這應該被視為 county
        // 註：這部分補強邏輯可視後端規範調整，目前優先確保「選擇縣市時發送的是 county」
      }
      
      if (lat !== undefined && lon !== undefined) {
        url += `lat=${lat}&lng=${lon}&`;
      }
      
      // 移除結尾多餘的 &
      url = url.replace(/[&?]$/, "");

      const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));
      const fetchPromise = fetch(url).then(res => res.json());

      const [_, json] = await Promise.all([delayPromise, fetchPromise]) as [unknown, WeatherData];

      if (json.success) {
        // [邏輯強化] 處理全縣市鄉鎮列表的回傳格式 (如座標定位後的回傳)
        const weatherData = json.data;
        
        // 如果頂層沒有 forecasts，但有 locations 陣列 (後端座標查詢回傳格式)
        if ((!weatherData.forecasts || weatherData.forecasts.length === 0) && (weatherData as any).locations) {
          const firstLocation = (weatherData as any).locations[0];
          if (firstLocation) {
            forecasts.value = firstLocation.forecasts || [];
            //優先取鄉鎮名，其次取縣市名
            city.value = firstLocation.township || (weatherData as any).county || weatherData.city;
          }
        } else {
          // 標準單一地區格式
          forecasts.value = weatherData.forecasts || [];
          city.value = weatherData.city || (weatherData as any).county || "";
        }
        
        const now = new Date();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const dayIndex = now.getDay();
        const days = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
        updateDate.value = `${month}月${date}日 ${days[dayIndex]}`;
      } else {
        throw new Error("API Error");
      }
    } catch (e) {
      console.error(e);
      alert("天氣資料讀取失敗，狸克把網路線咬斷了！");
    } finally {
      isLoading.value = false;
    }
  };

  const initWeather = async (cityName: string = "目前位置", countyName?: string) => {
    selectedCity.value = cityName;
    
    if (cityName === "目前位置") {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeather("目前位置", undefined, latitude, longitude);
          },
          (error) => {
            console.warn("Geolocation failed or denied:", error);
            fetchWeather("臺中市"); // Fallback
          },
          { timeout: 10000 }
        );
      } else {
        fetchWeather("臺中市");
      }
    } else {
      // 檢查 cityName 是否為 locations 中的縣市名稱
      const isCounty = locations.some((l: any) => l.name === cityName && cityName !== "目前位置");
      if (isCounty) {
        // 如果選的是縣市（如：彰化縣），發送 county 參數
        fetchWeather(undefined, cityName);
      } else {
        // 如果選的是鄉鎮（如：花壇鄉），同時發送 city 與 county
        fetchWeather(cityName, countyName);
      }
    }
  };

  onMounted(initWeather);

  return {
    forecasts,
    city,
    selectedCity,
    isLoading,
    updateDate,
    getWeatherIcon,
    getAdvice,
    getTimePeriod,
    initWeather
  };
}
