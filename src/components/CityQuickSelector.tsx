import React from "react";
import { MapPin, Navigation } from "lucide-react";

interface CityQuickSelectorProps {
  currentCity: string;
  onSelectCity: (city: string) => void;
  onSelectLocation: () => void;
  isLoadingLocation: boolean;
}

const DOMESTIC_CITIES = [
  { name: "서울", query: "Seoul" },
  { name: "부산", query: "Busan" },
  { name: "제주", query: "Jeju" },
  { name: "인천", query: "Incheon" },
];

const INTERNATIONAL_CITIES = [
  { name: "도쿄", query: "Tokyo" },
  { name: "뉴욕", query: "New York" },
  { name: "런던", query: "London" },
  { name: "파리", query: "Paris" },
  { name: "시드니", query: "Sydney" },
];

export const CityQuickSelector: React.FC<CityQuickSelectorProps> = ({
  currentCity,
  onSelectCity,
  onSelectLocation,
  isLoadingLocation,
}) => {
  const isCityActive = (cityQuery: string, cityName: string) => {
    return (
      currentCity.toLowerCase() === cityQuery.toLowerCase() ||
      currentCity === cityName
    );
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-4xl mx-auto" id="city-selector-container">
      {/* Selector Header */}
      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1 px-1">
        <span className="flex items-center gap-1">
          <MapPin size={12} className="text-sky-600" /> 주요 도시 선택
        </span>
        <button
          onClick={onSelectLocation}
          disabled={isLoadingLocation}
          className="flex items-center gap-1.5 text-sky-700 hover:text-sky-800 transition-colors cursor-pointer bg-sky-500/10 border border-sky-300/30 px-3 py-1 rounded-full text-[11px] font-semibold"
          id="gps-location-btn"
        >
          <Navigation size={10} className={`${isLoadingLocation ? "animate-spin" : ""}`} />
          {isLoadingLocation ? "위치 조회 중..." : "내 위치 조회"}
        </button>
      </div>

      {/* Categorized Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Domestic Cities */}
        <div className="flex flex-col gap-1.5 bg-slate-500/5 p-3 rounded-2xl border border-slate-500/10">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">국내 주요 도시</span>
          <div className="flex flex-wrap gap-1.5">
            {DOMESTIC_CITIES.map((city) => {
              const isActive = isCityActive(city.query, city.name);
              return (
                <button
                  key={city.query}
                  onClick={() => onSelectCity(city.query)}
                  className={`flex-1 min-w-[65px] text-center px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border cursor-pointer ${
                    isActive
                      ? "bg-sky-600 border-sky-600 text-white font-bold shadow-md shadow-sky-600/10"
                      : "bg-white/60 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300"
                  }`}
                  id={`city-btn-${city.query}`}
                >
                  {city.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* International Cities */}
        <div className="flex flex-col gap-1.5 bg-slate-500/5 p-3 rounded-2xl border border-slate-500/10">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">글로벌 추천 도시</span>
          <div className="flex flex-wrap gap-1.5">
            {INTERNATIONAL_CITIES.map((city) => {
              const isActive = isCityActive(city.query, city.name);
              return (
                <button
                  key={city.query}
                  onClick={() => onSelectCity(city.query)}
                  className={`flex-1 min-w-[65px] text-center px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border cursor-pointer ${
                    isActive
                      ? "bg-sky-600 border-sky-600 text-white font-bold shadow-md shadow-sky-600/10"
                      : "bg-white/60 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300"
                  }`}
                  id={`city-btn-${city.query}`}
                >
                  {city.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
