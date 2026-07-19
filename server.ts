import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Helper to get realistic mock weather data if API key is missing
function getMockWeatherData(city: string) {
  const normalized = city.trim().toLowerCase();
  
  // Choose standard coordinates & default attributes for major cities
  let cityName = "서울";
  let tempBase = 24.5;
  let conditionText = "맑음";
  let conditionCode = 1000;
  let conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/113.png";
  let humidity = 60;
  let windSpeed = 12;
  let pm2_5 = 15.4;
  let pm10 = 28.2;

  if (normalized.includes("busan") || normalized.includes("부산")) {
    cityName = "부산";
    tempBase = 26.0;
    conditionText = "구름 조금";
    conditionCode = 1003;
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/116.png";
    humidity = 68;
    windSpeed = 18;
    pm2_5 = 12.1;
    pm10 = 22.5;
  } else if (normalized.includes("jeju") || normalized.includes("제주")) {
    cityName = "제주";
    tempBase = 27.2;
    conditionText = "가끔 비";
    conditionCode = 1063;
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/176.png";
    humidity = 80;
    windSpeed = 22;
    pm2_5 = 8.5;
    pm10 = 15.0;
  } else if (normalized.includes("incheon") || normalized.includes("인천")) {
    cityName = "인천";
    tempBase = 23.8;
    conditionText = "흐림";
    conditionCode = 1009;
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/122.png";
    humidity = 72;
    windSpeed = 15;
    pm2_5 = 22.0;
    pm10 = 40.8;
  } else if (normalized.includes("daegu") || normalized.includes("대구")) {
    cityName = "대구";
    tempBase = 29.5;
    conditionText = "맑고 더움";
    conditionCode = 1000;
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/113.png";
    humidity = 45;
    windSpeed = 8;
    pm2_5 = 28.3;
    pm10 = 45.1;
  } else if (normalized.includes("daejeon") || normalized.includes("대전")) {
    cityName = "대전";
    tempBase = 25.0;
    conditionText = "맑음";
    conditionCode = 1000;
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/113.png";
    humidity = 55;
    windSpeed = 10;
    pm2_5 = 18.0;
    pm10 = 32.4;
  } else if (normalized.includes("gwangju") || normalized.includes("광주")) {
    cityName = "광주";
    tempBase = 25.8;
    conditionText = "구름 조금";
    conditionCode = 1003;
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/116.png";
    humidity = 58;
    windSpeed = 11;
    pm2_5 = 16.5;
    pm10 = 30.0;
  } else if (normalized.includes("ulsan") || normalized.includes("울산")) {
    cityName = "울산";
    tempBase = 24.8;
    conditionText = "흐림";
    conditionCode = 1009;
    conditionIcon = "//cdn.weatherapi.com/weather/64x64/day/122.png";
    humidity = 65;
    windSpeed = 14;
    pm2_5 = 14.0;
    pm10 = 26.8;
  } else {
    // Treat as search query directly or fall back to input query capitalized
    cityName = city.charAt(0).toUpperCase() + city.slice(1);
    tempBase = 22.0 + Math.random() * 6;
    const conds = [
      { text: "맑음", icon: "//cdn.weatherapi.com/weather/64x64/day/113.png", code: 1000 },
      { text: "구름 조금", icon: "//cdn.weatherapi.com/weather/64x64/day/116.png", code: 1003 },
      { text: "흐림", icon: "//cdn.weatherapi.com/weather/64x64/day/122.png", code: 1009 },
      { text: "가끔 비", icon: "//cdn.weatherapi.com/weather/64x64/day/176.png", code: 1063 }
    ];
    const chosen = conds[Math.floor(Math.random() * conds.length)];
    conditionText = chosen.text;
    conditionIcon = chosen.icon;
    conditionCode = chosen.code;
    humidity = 50 + Math.floor(Math.random() * 30);
    windSpeed = 5 + Math.floor(Math.random() * 15);
  }

  // Create current date details
  const today = new Date();
  const formatTime = (d: Date) => d.toISOString().replace("T", " ").substring(0, 16);

  // Generate 5 days of forecasts
  const forecastdays = Array.from({ length: 5 }).map((_, i) => {
    const fDate = new Date();
    fDate.setDate(today.getDate() + i);
    const dateStr = fDate.toISOString().substring(0, 10);
    
    // Vary temperatures around base
    const max = Math.round((tempBase + 3 - i * 0.5 + Math.random() * 3) * 10) / 10;
    const min = Math.round((tempBase - 5 - i * 0.8 + Math.random() * 3) * 10) / 10;
    const avg = Math.round(((max + min) / 2) * 10) / 10;

    let dayCond = "맑음";
    let dayIcon = "//cdn.weatherapi.com/weather/64x64/day/113.png";
    let dayCode = 1000;
    let rainChance = 10;

    if (i === 1) {
      dayCond = "구름 조금";
      dayIcon = "//cdn.weatherapi.com/weather/64x64/day/116.png";
      dayCode = 1003;
      rainChance = 20;
    } else if (i === 2) {
      dayCond = "흐림";
      dayIcon = "//cdn.weatherapi.com/weather/64x64/day/122.png";
      dayCode = 1009;
      rainChance = 35;
    } else if (i === 3) {
      dayCond = "가끔 비";
      dayIcon = "//cdn.weatherapi.com/weather/64x64/day/176.png";
      dayCode = 1063;
      rainChance = 75;
    } else if (i === 4) {
      dayCond = "맑음";
      dayIcon = "//cdn.weatherapi.com/weather/64x64/day/113.png";
      dayCode = 1000;
      rainChance = 5;
    }

    // Generate hourly forecasts (every 3 hours: 0, 3, 6, 9, 12, 15, 18, 21)
    const hours = Array.from({ length: 8 }).map((_, hIdx) => {
      const hTime = `${dateStr} ${String(hIdx * 3).padStart(2, "0")}:00`;
      const hourTemp = Math.round((avg + Math.sin((hIdx - 2) * Math.PI / 4) * 4) * 10) / 10;
      return {
        time: hTime,
        temp_c: hourTemp,
        condition: {
          text: hIdx > 6 || hIdx < 2 ? "맑음" : dayCond,
          icon: hIdx > 6 || hIdx < 2 ? "//cdn.weatherapi.com/weather/64x64/night/113.png" : dayIcon,
          code: dayCode
        },
        is_day: hIdx > 2 && hIdx < 7 ? 1 : 0
      };
    });

    return {
      date: dateStr,
      date_epoch: Math.floor(fDate.getTime() / 1000),
      day: {
        maxtemp_c: max,
        mintemp_c: min,
        avgtemp_c: avg,
        maxwind_kph: windSpeed + 5,
        totalprecip_mm: rainChance > 50 ? 5.4 : 0,
        totalsnow_cm: 0,
        avgvis_km: 10,
        avghumidity: humidity,
        daily_will_it_rain: rainChance > 50 ? 1 : 0,
        daily_chance_of_rain: rainChance,
        daily_will_it_snow: 0,
        daily_chance_of_snow: 0,
        condition: {
          text: dayCond,
          icon: dayIcon,
          code: dayCode
        },
        uv: 5
      },
      hour: hours
    };
  });

  return {
    demo: true,
    location: {
      name: cityName,
      region: "대한민국",
      country: "South Korea",
      lat: 37.57,
      lon: 126.98,
      tz_id: "Asia/Seoul",
      localtime_epoch: Math.floor(today.getTime() / 1000),
      localtime: formatTime(today)
    },
    current: {
      last_updated_epoch: Math.floor(today.getTime() / 1000),
      last_updated: formatTime(today),
      temp_c: tempBase,
      is_day: today.getHours() > 6 && today.getHours() < 20 ? 1 : 0,
      condition: {
        text: conditionText,
        icon: conditionIcon,
        code: conditionCode
      },
      wind_kph: windSpeed,
      wind_degree: 180,
      wind_dir: "S",
      pressure_mb: 1012,
      precip_mm: 0,
      humidity: humidity,
      cloud: 20,
      feelslike_c: tempBase + 0.8,
      vis_km: 10,
      uv: 6,
      gust_kph: windSpeed + 6,
      air_quality: {
        co: 250,
        no2: 15,
        o3: 40,
        so2: 4,
        pm2_5: pm2_5,
        pm10: pm10,
        "us-epa-index": pm2_5 > 35 ? 3 : (pm2_5 > 12 ? 2 : 1)
      }
    },
    forecast: {
      forecastday: forecastdays
    }
  };
}

// API endpoint to proxy weather queries
app.get("/api/weather", async (req, res) => {
  try {
    const q = (req.query.q as string) || "서울";
    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      // Return beautiful simulated data in exact WeatherAPI schema with a demo flag
      const mockData = getMockWeatherData(q);
      return res.json(mockData);
    }

    // Make request to WeatherAPI.com
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(
      q
    )}&days=5&aqi=yes&alerts=yes&lang=ko`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errText = await response.text();
      console.error("WeatherAPI returned an error:", errText);
      // Fallback to mock data if API request fails (e.g. invalid key or rate limits)
      const mockData = getMockWeatherData(q);
      return res.json({ ...mockData, error: "API key error or city not found. Displaying offline/simulated data." });
    }

    const data = await response.json();
    return res.json({ ...data, demo: false });
  } catch (error: any) {
    console.error("Error in /api/weather endpoint:", error);
    res.status(500).json({ error: "날씨 정보를 불러오는 중 서버 에러가 발생했습니다." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
