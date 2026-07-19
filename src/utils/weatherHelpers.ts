// Weather condition helper utilities for translations and theme styles

export interface WeatherTheme {
  bgGradient: string; // Tailwind gradient classes
  cardBg: string; // Tailwind glassmorphism card classes
  textColor: string;
  accentColor: string;
  glowColor: string;
  emoji: string;
}

export function getWeatherTheme(code: number, isDay: number): WeatherTheme {
  const isNight = isDay === 0;

  if (isNight) {
    return {
      bgGradient: "from-[#0284c7]/20 via-[#0369a1]/30 to-[#0c4a6e]/40", // Midnight sky-blue tone
      cardBg: "editorial-glass border-slate-200/50 text-slate-800",
      textColor: "text-slate-800",
      accentColor: "text-sky-600 bg-sky-500/10 border-sky-500/20",
      glowColor: "rgba(14, 165, 233, 0.15)",
      emoji: "🌙"
    };
  }

  // Sunny/Clear
  if (code === 1000) {
    return {
      bgGradient: "from-[#bae6fd] via-[#e0f2fe] to-[#fef08a]", // Sunny gold sky blue
      cardBg: "editorial-glass border-amber-200/50 text-slate-800",
      textColor: "text-slate-800",
      accentColor: "text-amber-700 bg-amber-500/10 border-amber-500/20",
      glowColor: "rgba(245, 158, 11, 0.2)",
      emoji: "☀️"
    };
  }

  // Partly Cloudy
  if (code === 1003) {
    return {
      bgGradient: "from-[#bae6fd] via-[#f0f9ff] to-[#e0f2fe]", // Light clouds sky blue
      cardBg: "editorial-glass border-sky-200/50 text-slate-800",
      textColor: "text-slate-800",
      accentColor: "text-sky-700 bg-sky-500/10 border-sky-500/20",
      glowColor: "rgba(14, 165, 233, 0.15)",
      emoji: "⛅"
    };
  }

  // Cloudy/Overcast/Mist
  if (code === 1006 || code === 1009 || code === 1030 || code === 1135 || code === 1147) {
    return {
      bgGradient: "from-[#cbd5e1] via-[#f1f5f9] to-[#bae6fd]", // Misty sky blue
      cardBg: "editorial-glass border-slate-300/50 text-slate-800",
      textColor: "text-slate-800",
      accentColor: "text-slate-600 bg-slate-500/10 border-slate-500/20",
      glowColor: "rgba(148, 163, 184, 0.15)",
      emoji: "☁️"
    };
  }

  // Rain / Showers / Drizzle
  if (
    code === 1063 || 
    (code >= 1150 && code <= 1201) || 
    (code >= 1240 && code <= 1246) || 
    code === 1180 || 
    code === 1183 || 
    code === 1186 || 
    code === 1189 || 
    code === 1192 || 
    code === 1195
  ) {
    return {
      bgGradient: "from-[#7dd3fc] via-[#e0f2fe] to-[#94a3b8]", // Soft rainy sky blue
      cardBg: "editorial-glass border-blue-200/50 text-slate-800",
      textColor: "text-slate-800",
      accentColor: "text-blue-700 bg-blue-500/10 border-blue-500/20",
      glowColor: "rgba(37, 99, 235, 0.15)",
      emoji: "🌧️"
    };
  }

  // Snow / Ice
  if (
    code === 1066 || 
    (code >= 1210 && code <= 1225) || 
    (code >= 1255 && code <= 1258) || 
    code === 1114 || 
    code === 1117
  ) {
    return {
      bgGradient: "from-[#e0f2fe] via-[#ffffff] to-[#bae6fd]", // Frosty crisp sky blue
      cardBg: "editorial-glass border-sky-100/50 text-slate-800",
      textColor: "text-slate-800",
      accentColor: "text-sky-700 bg-sky-500/10 border-sky-500/20",
      glowColor: "rgba(14, 165, 233, 0.12)",
      emoji: "❄️"
    };
  }

  // Thunderstorms
  if (code === 1087 || (code >= 1273 && code <= 1282)) {
    return {
      bgGradient: "from-[#38bdf8]/40 via-[#f1f5f9] to-[#c084fc]/30", // Thunder purple light blue
      cardBg: "editorial-glass border-purple-200/50 text-slate-800",
      textColor: "text-slate-800",
      accentColor: "text-purple-700 bg-purple-500/10 border-purple-500/20",
      glowColor: "rgba(168, 85, 247, 0.15)",
      emoji: "⚡"
    };
  }

  // Default Fallback
  return {
    bgGradient: "from-[#bae6fd] via-[#f0f9ff] to-[#e0f2fe]",
    cardBg: "editorial-glass border-slate-200/50 text-slate-800",
    textColor: "text-slate-800",
    accentColor: "text-sky-700 bg-sky-500/10 border-sky-500/20",
    glowColor: "rgba(14, 165, 233, 0.15)",
    emoji: "✨"
  };
}

// Get Korean weekday name from date string
export function getKoreanDayName(dateStr: string): string {
  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const date = new Date(dateStr);
  return days[date.getDay()];
}

// Translate simple weather condition text in case WeatherAPI didn't translate or as clean display label
export function cleanConditionText(text: string): string {
  const t = text.trim();
  // Simple check for English terms and map to beautiful Korean
  if (t === "Sunny" || t === "Clear") return "맑음";
  if (t === "Partly cloudy") return "구름 조금";
  if (t === "Cloudy") return "흐림";
  if (t === "Overcast") return "흐림";
  if (t === "Mist") return "안개";
  if (t === "Patchy rain possible" || t === "Patchy rain nearby") return "가끔 비";
  if (t === "Light rain") return "가벼운 비";
  if (t === "Moderate rain") return "비";
  if (t === "Heavy rain") return "강한 비";
  if (t === "Thundery outbreaks possible") return "천둥번개 동반";
  return t;
}

// Map US EPA Air Quality Index to highly readable Korean level
export interface AQIStatus {
  label: string;
  colorClass: string;
  textColor: string;
}

export function getAQIStatus(index: number): AQIStatus {
  switch (index) {
    case 1:
      return { label: "좋음 (Good)", colorClass: "bg-emerald-500/15 border-emerald-500/30", textColor: "text-emerald-600 dark:text-emerald-400" };
    case 2:
      return { label: "보통 (Moderate)", colorClass: "bg-amber-500/15 border-amber-500/30", textColor: "text-amber-600 dark:text-amber-400" };
    case 3:
      return { label: "민감군 영향 (Unhealthy for Sensitive Groups)", colorClass: "bg-orange-500/15 border-orange-500/30", textColor: "text-orange-600 dark:text-orange-400" };
    case 4:
      return { label: "나쁨 (Unhealthy)", colorClass: "bg-red-500/15 border-red-500/30", textColor: "text-red-600 dark:text-red-400" };
    case 5:
      return { label: "매우 나쁨 (Very Unhealthy)", colorClass: "bg-purple-500/15 border-purple-500/30", textColor: "text-purple-600 dark:text-purple-400" };
    case 6:
      return { label: "위험 (Hazardous)", colorClass: "bg-rose-900/20 border-rose-900/40", textColor: "text-rose-600 dark:text-rose-400" };
    default:
      return { label: "정보 없음", colorClass: "bg-slate-500/15 border-slate-500/30", textColor: "text-slate-600" };
  }
}
