import React from "react";
import { 
  Thermometer, 
  Wind, 
  Droplets, 
  Sun, 
  Activity,
  AlertCircle
} from "lucide-react";
import { WeatherResponse } from "../types";
import { cleanConditionText, getAQIStatus, WeatherTheme } from "../utils/weatherHelpers";

interface CurrentWeatherCardProps {
  data: WeatherResponse;
  theme: WeatherTheme;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data, theme }) => {
  const { current, location } = data;
  const aqi = current.air_quality;
  const aqiStatus = aqi ? getAQIStatus(aqi["us-epa-index"]) : null;

  // Format local time nicely
  const getFormattedLocaltime = () => {
    try {
      if (!location.localtime) return "";
      const date = new Date(location.localtime);
      return date.toLocaleDateString("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return location.localtime;
    }
  };

  return (
    <div 
      className={`w-full max-w-4xl mx-auto rounded-3xl p-6 md:p-10 border shadow-2xl transition-all duration-300 ${theme.cardBg}`}
      style={{ boxShadow: `0 30px 60px -20px ${theme.glowColor}` }}
      id="current-weather-card"
    >
      {/* Editorial Header Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-900/5 pb-6 mb-8">
        <div className="location-info">
          <span className="text-[11px] md:text-xs font-bold uppercase tracking-[0.25em] text-sky-600 block mb-1">
            CURRENT LOCATION
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light font-serif italic text-slate-800 tracking-tight">
            {location.name}, <span className="text-slate-500 font-normal not-italic text-2xl md:text-3xl">{location.region || "대한민국"}</span>
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mt-1">
            {location.country} • {getFormattedLocaltime()} 기준
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          {data.demo && (
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[11px] px-3 py-1.5 rounded-full font-medium">
              <AlertCircle size={13} />
              데모 모드 활성화됨
            </div>
          )}
          <span className="text-xs uppercase tracking-[0.1em] text-slate-500 text-left md:text-right font-semibold">
            {cleanConditionText(current.condition.text)}
          </span>
        </div>
      </div>

      {/* Hero Display: Giant temperature & rotating side tag */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 py-6 mb-8">
        
        {/* Left side: Animated Icon and rotating/regular state label */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-[#38BDF8]/20 rounded-full blur-2xl animate-pulse"></div>
            {current.condition.icon ? (
              <img 
                src={`https:${current.condition.icon}`} 
                alt={current.condition.text}
                className="w-24 h-24 md:w-32 md:h-32 relative z-10 drop-shadow-xl"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-7xl md:text-8xl relative z-10 block">{theme.emoji}</span>
            )}
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sky-600 block mb-0.5">DISPLAY CONDITION</span>
            <p className="text-2xl md:text-3xl font-light font-serif italic text-slate-800">
              {cleanConditionText(current.condition.text)}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              체감 온도 {Math.round(current.feelslike_c)}°C
            </p>
          </div>
        </div>

        {/* Right side: Giant Editorial display temp */}
        <div className="relative flex items-center pr-6 md:pr-10">
          <span className="editorial-temp-display">
            {Math.round(current.temp_c)}
          </span>
          <span className="absolute top-2 md:top-6 right-0 text-4xl md:text-6xl font-extralight text-sky-600">°C</span>
        </div>
      </div>

      {/* Minimalistic Editorial Grid for Key stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-900/5 border border-slate-900/5 rounded-2xl overflow-hidden mb-8" id="editorial-stats-grid">
        <div className="bg-white/40 p-5 backdrop-blur-sm">
          <span className="text-[10px] tracking-[0.18em] text-slate-500 uppercase mb-2 block font-semibold">체감 온도</span>
          <div className="flex items-center gap-2">
            <Thermometer size={16} className="text-amber-500" />
            <span className="text-xl md:text-2xl font-light text-slate-800">{Math.round(current.feelslike_c)}°C</span>
          </div>
        </div>

        <div className="bg-white/40 p-5 backdrop-blur-sm">
          <span className="text-[10px] tracking-[0.18em] text-slate-500 uppercase mb-2 block font-semibold">풍속 / 풍향</span>
          <div className="flex items-center gap-2">
            <Wind size={16} className="text-sky-500" />
            <span className="text-xl md:text-2xl font-light text-slate-800">
              {current.wind_kph} <span className="text-xs text-slate-500 font-semibold uppercase font-mono">{current.wind_dir}</span>
            </span>
          </div>
        </div>

        <div className="bg-white/40 p-5 backdrop-blur-sm">
          <span className="text-[10px] tracking-[0.18em] text-slate-500 uppercase mb-2 block font-semibold">대기 습도</span>
          <div className="flex items-center gap-2">
            <Droplets size={16} className="text-sky-600" />
            <span className="text-xl md:text-2xl font-light text-slate-800">{current.humidity}%</span>
          </div>
        </div>

        <div className="bg-white/40 p-5 backdrop-blur-sm">
          <span className="text-[10px] tracking-[0.18em] text-slate-500 uppercase mb-2 block font-semibold">자외선 지수</span>
          <div className="flex items-center gap-2">
            <Sun size={16} className="text-amber-500" />
            <span className="text-xl md:text-2xl font-light text-slate-800">{current.uv} <span className="text-xs text-slate-500">/ 10</span></span>
          </div>
        </div>
      </div>

      {/* Air Quality Index Block (AQI) */}
      {aqi && (
        <div className="mt-8 pt-8 border-t border-slate-900/5" id="air-quality-container">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} className="text-sky-600" />
            <h3 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">대기질 정보 (Air Quality)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`sm:col-span-1 border border-slate-200/50 p-4 rounded-xl flex flex-col justify-between bg-white/40 backdrop-blur-sm`}>
              <span className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">종합 대기 지수</span>
              <span className={`text-sm font-bold mt-2 ${aqiStatus?.textColor}`}>
                {aqiStatus?.label}
              </span>
            </div>

            <div className="bg-white/40 border border-slate-200/50 p-4 rounded-xl flex flex-col justify-between backdrop-blur-sm">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider flex justify-between items-center font-semibold">
                초미세먼지 <span className="text-[9px] uppercase font-mono text-slate-400">PM2.5</span>
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-semibold text-slate-800">{aqi.pm2_5.toFixed(1)}</span>
                  <span className="text-[10px] text-slate-500">µg/m³</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${aqi.pm2_5 > 35 ? "bg-red-500/10 text-red-600" : (aqi.pm2_5 > 15 ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600")}`}>
                  {aqi.pm2_5 > 75 ? "매우나쁨" : (aqi.pm2_5 > 35 ? "나쁨" : (aqi.pm2_5 > 15 ? "보통" : "좋음"))}
                </span>
              </div>
            </div>

            <div className="bg-white/40 border border-slate-200/50 p-4 rounded-xl flex flex-col justify-between backdrop-blur-sm">
              <span className="text-slate-500 text-[10px] uppercase tracking-wider flex justify-between items-center font-semibold">
                미세먼지 <span className="text-[9px] uppercase font-mono text-slate-400">PM10</span>
              </span>
              <div className="flex items-baseline justify-between mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-semibold text-slate-800">{aqi.pm10.toFixed(1)}</span>
                  <span className="text-[10px] text-slate-500">µg/m³</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${aqi.pm10 > 80 ? "bg-red-500/10 text-red-600" : (aqi.pm10 > 30 ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600")}`}>
                  {aqi.pm10 > 150 ? "매우나쁨" : (aqi.pm10 > 80 ? "나쁨" : (aqi.pm10 > 30 ? "보통" : "좋음"))}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
