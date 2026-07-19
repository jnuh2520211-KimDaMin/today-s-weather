import React, { useState, useEffect } from "react";
import { Search, CloudSun, Compass, AlertTriangle, ArrowRight, Sun, CloudRain } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WeatherResponse } from "./types";
import { getWeatherTheme } from "./utils/weatherHelpers";
import { CityQuickSelector } from "./components/CityQuickSelector";
import { CurrentWeatherCard } from "./components/CurrentWeatherCard";
import { ForecastSection } from "./components/ForecastSection";

export default function App() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("Seoul");
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Fetch weather data on component mount and when city changes
  const fetchWeather = async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/weather?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error("날씨 정보를 가져오는데 실패했습니다.");
      }
      const data: WeatherResponse = await response.json();
      if (data.error) {
        setError(data.error);
      }
      setWeatherData(data);
      // Synchronize the text input search box if needed
      setQuery("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "날씨 데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setCity(query.trim());
  };

  const handleQuickCitySelect = (cityQuery: string) => {
    setCity(cityQuery);
  };

  const handleGeolocationSelect = () => {
    if (!navigator.geolocation) {
      setError("이 브라우저에서는 GPS 위치 조회를 지원하지 않습니다.");
      return;
    }

    setIsLoadingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // WeatherAPI supports lat,lon directly in query string
        const geoQuery = `${latitude},${longitude}`;
        setCity(geoQuery);
        setIsLoadingLocation(false);
      },
      (geoError) => {
        console.error(geoError);
        setIsLoadingLocation(false);
        setError("GPS 위치 정보를 받아오는데 실패했습니다. 위치 권한을 허용했는지 확인해 주세요.");
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  // Get dynamic weather theme
  const theme = weatherData 
    ? getWeatherTheme(weatherData.current.condition.code, weatherData.current.is_day)
    : getWeatherTheme(1000, 1); // Default to day sunny

  return (
    <div 
      className={`min-h-screen w-full transition-all duration-1000 bg-gradient-to-br ${theme.bgGradient} flex flex-col font-sans relative overflow-hidden`}
      id="app-root-layout"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-0 w-full overflow-hidden h-[600px] pointer-events-none select-none z-0">
        <div 
          className="absolute -top-[10%] left-[15%] w-[450px] h-[450px] rounded-full blur-[140px] opacity-35 transition-all duration-1000"
          style={{ backgroundColor: theme.glowColor }}
        ></div>
        <div 
          className="absolute top-[25%] right-[10%] w-[350px] h-[350px] rounded-full blur-[120px] opacity-20 transition-all duration-1000"
          style={{ backgroundColor: theme.glowColor }}
        ></div>
      </div>

      {/* Main Container */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-16 flex flex-col gap-8 relative z-10">
        
        {/* Header Branding */}
        <header className="flex flex-col items-center text-center gap-2 mb-2" id="app-header">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/60 border border-slate-200 text-sky-600 rounded-2xl shadow-xl backdrop-blur-md">
              <CloudSun size={24} className="animate-pulse" />
            </div>
            <h2 className="text-3xl md:text-4xl font-light font-serif italic text-slate-800 tracking-tight">
              오늘의 날씨
            </h2>
          </div>
          <p className="text-slate-500 text-xs md:text-sm tracking-[0.18em] font-bold uppercase">
            REAL-TIME WEATHER DATA & FORECAST
          </p>
        </header>

        {/* Search Bar Form */}
        <div className="w-full max-w-xl mx-auto" id="search-bar-container">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="도시명을 검색하세요 (예: 서울, 제주, 뉴욕, 런던...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border border-slate-200 focus:border-sky-500 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-sky-500/10 transition-all duration-200 placeholder:text-slate-400 text-slate-800 shadow-xl backdrop-blur-md"
                id="city-search-input"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-sky-600 text-white hover:bg-sky-700 rounded-2xl font-bold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-sky-500/10 flex items-center gap-1.5 shrink-0"
              id="search-submit-btn"
            >
              검색 <ArrowRight size={13} />
            </button>
          </form>
        </div>

        {/* Quick Selector Row */}
        <CityQuickSelector
          currentCity={city}
          onSelectCity={handleQuickCitySelect}
          onSelectLocation={handleGeolocationSelect}
          isLoadingLocation={isLoadingLocation}
        />

        {/* Status Area */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-4xl mx-auto p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-start gap-3 shadow-md backdrop-blur-md"
              id="error-banner"
            >
              <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={16} />
              <div className="flex-1 text-xs md:text-sm">
                <span className="font-bold">알림 • </span>
                {error}
              </div>
            </motion.div>
          )}

          {loading ? (
            <motion.div
              key="loading-spinner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-center py-20 gap-4"
              id="loading-indicator"
            >
              <div className="relative">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-sky-600 animate-pulse">
                  <Compass size={16} />
                </div>
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 animate-pulse">WEATHER DATA SYNCHRONIZING...</p>
            </motion.div>
          ) : (
            weatherData && (
              <motion.div
                key={weatherData.location.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col gap-6"
                id="weather-details-section"
              >
                {/* Current Weather Card */}
                <CurrentWeatherCard data={weatherData} theme={theme} />

                {/* Forecast (Hourly + 5-Day) */}
                <ForecastSection forecast={weatherData.forecast} theme={theme} />
              </motion.div>
            )
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-auto pt-12 text-center border-t border-slate-900/5 text-[10px] uppercase tracking-wider text-slate-500" id="app-footer">
          <p>© {new Date().getFullYear()} 오늘의 날씨 • EDITORIAL DESIGN LAB</p>
          <p className="mt-1 font-mono text-[9px] tracking-normal">
            POWERED BY{" "}
            <a 
              href="https://weatherapi.com/" 
              target="_blank" 
              rel="noreferrer"
              className="font-bold text-sky-600 hover:underline"
            >
              WEATHERAPI.COM
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
