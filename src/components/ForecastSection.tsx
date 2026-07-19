import React from "react";
import { Clock, Calendar, Umbrella } from "lucide-react";
import { ForecastData } from "../types";
import { cleanConditionText, getKoreanDayName, WeatherTheme } from "../utils/weatherHelpers";

interface ForecastSectionProps {
  forecast: ForecastData;
  theme: WeatherTheme;
}

export const ForecastSection: React.FC<ForecastSectionProps> = ({ forecast, theme }) => {
  const todayForecast = forecast.forecastday[0];
  
  // Format hourly time nicely (e.g., "오후 3시" or "15시")
  const formatHour = (timeStr: string) => {
    try {
      const date = new Date(timeStr);
      const hours = date.getHours();
      const ampm = hours >= 12 ? "오후" : "오전";
      const displayHour = hours % 12 === 0 ? 12 : hours % 12;
      return `${ampm} ${displayHour}시`;
    } catch {
      return timeStr.split(" ")[1] || timeStr;
    }
  };

  // Format forecast date nicely (e.g. "7월 19일")
  const formatDateLabel = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return `${date.getMonth() + 1}월 ${date.getDate()}일`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6" id="forecast-section">
      {/* Hourly Forecast */}
      <div 
        className={`rounded-3xl p-6 border shadow-xl ${theme.cardBg}`}
        id="hourly-forecast-container"
      >
        <div className="flex items-center gap-2 mb-5 border-b border-slate-900/5 pb-3">
          <Clock size={14} className="text-sky-600" />
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">시간대별 날씨 (오늘)</h3>
        </div>

        {/* Horizontal scroll for hours */}
        <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          {todayForecast.hour.map((h, idx) => (
            <div 
              key={idx}
              className="flex flex-col items-center min-w-[80px] p-4 rounded-xl bg-white/40 border border-slate-200/50 hover:bg-white/80 transition-all duration-150 text-center backdrop-blur-sm shadow-sm"
              id={`hour-item-${idx}`}
            >
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">{formatHour(h.time)}</span>
              {h.condition.icon ? (
                <img 
                  src={`https:${h.condition.icon}`} 
                  alt={h.condition.text}
                  className="w-10 h-10 my-2 drop-shadow"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-xl my-2">☁️</span>
              )}
              <span className="text-sm font-bold text-slate-800">{Math.round(h.temp_c)}°</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Day Daily Forecast */}
      <div 
        className={`rounded-3xl p-6 border shadow-xl ${theme.cardBg}`}
        id="daily-forecast-container"
      >
        <div className="flex items-center gap-2 mb-5 border-b border-slate-900/5 pb-3">
          <Calendar size={14} className="text-sky-600" />
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">5일간의 예보</h3>
        </div>

        <div className="flex flex-col gap-3">
          {forecast.forecastday.map((dayData, idx) => {
            const isToday = idx === 0;
            return (
              <div 
                key={dayData.date}
                className="flex items-center justify-between p-4 rounded-xl bg-white/40 border border-slate-200/50 hover:bg-white/80 transition-all duration-150 backdrop-blur-sm shadow-sm"
                id={`daily-forecast-item-${idx}`}
              >
                {/* Date Label */}
                <div className="w-[120px] flex flex-col">
                  <span className="text-sm font-semibold font-serif italic text-slate-800">
                    {isToday ? "오늘" : getKoreanDayName(dayData.date)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider">{formatDateLabel(dayData.date)}</span>
                </div>

                {/* Condition and Rain Chance */}
                <div className="flex items-center gap-3 flex-1 px-4">
                  {dayData.day.condition.icon ? (
                    <img 
                      src={`https:${dayData.day.condition.icon}`} 
                      alt={dayData.day.condition.text}
                      className="w-9 h-9 drop-shadow"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-xl">☁️</span>
                  )}
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-semibold text-left text-slate-700">
                      {cleanConditionText(dayData.day.condition.text)}
                    </span>
                    {dayData.day.daily_chance_of_rain > 0 && (
                      <span className="text-[10px] text-sky-600 font-semibold flex items-center gap-0.5 mt-0.5">
                        <Umbrella size={9} /> 강수확률 {dayData.day.daily_chance_of_rain}%
                      </span>
                    )}
                  </div>
                </div>

                {/* High/Low Temps */}
                <div className="flex items-center gap-2.5 text-right">
                  <span className="text-xs text-blue-600 font-semibold font-mono">{Math.round(dayData.day.mintemp_c)}°</span>
                  <div className="w-14 h-1 bg-slate-200 rounded-full relative overflow-hidden">
                    <div className="absolute inset-y-0 left-1/4 right-1/4 bg-sky-400 rounded-full"></div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 font-mono">{Math.round(dayData.day.maxtemp_c)}°</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
