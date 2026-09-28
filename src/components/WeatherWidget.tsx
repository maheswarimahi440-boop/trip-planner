import React from 'react';
import { 
  CloudSun, 
  Sun, 
  CloudRain, 
  Cloud, 
  Wind, 
  Droplets, 
  Thermometer, 
  Sparkles,
  Luggage,
  Umbrella
} from 'lucide-react';
import { TripPlan } from '../types/trip';

interface WeatherWidgetProps {
  trip: TripPlan;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ trip }) => {
  const weather = trip.weatherForecast || {
    summary: 'Mild and pleasant conditions',
    avgTempC: 20,
    avgTempF: 68,
    condition: 'Partly Sunny',
    packingAdvice: 'Breathable layers and comfortable footwear',
    daily: []
  };

  const getWeatherIcon = (cond: string) => {
    const c = cond.toLowerCase();
    if (c.includes('rain') || c.includes('shower') || c.includes('mist')) return CloudRain;
    if (c.includes('cloud')) return Cloud;
    if (c.includes('wind') || c.includes('breeze')) return Wind;
    return Sun;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-cyan-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950/70 border border-cyan-700/60 px-2.5 py-1 rounded-full">
            Climate Intelligence & Forecast
          </span>
          <h2 className="text-xl sm:text-2xl font-black">
            {trip.destination} Weather Outlook
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            {weather.summary}
          </p>
          <div className="text-xs text-cyan-200 bg-white/10 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 mt-1">
            <Luggage className="w-3.5 h-3.5 text-cyan-300" />
            <span>{weather.packingAdvice}</span>
          </div>
        </div>

        {/* Current Weather Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-white min-w-[220px] text-center space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
            Expected Average
          </div>
          <div className="text-4xl font-black text-white flex items-center justify-center gap-2">
            <span>{weather.avgTempC}°C</span>
            <span className="text-sm font-semibold text-slate-300">/ {weather.avgTempF}°F</span>
          </div>
          <div className="text-xs font-semibold text-cyan-200 pt-1">
            {weather.condition}
          </div>
        </div>
      </div>

      {/* Daily Weather Cards */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-cyan-600" />
          Day-by-Day Forecast ({weather.daily?.length || trip.durationDays} Days)
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {(weather.daily || []).map((day) => {
            const Icon = getWeatherIcon(day.condition);
            return (
              <div
                key={day.day}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-cyan-300 hover:shadow-md transition-all text-center space-y-2"
              >
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Day {day.day}
                </div>

                <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>

                <div>
                  <div className="text-base font-black text-slate-900">
                    {day.highC}° <span className="text-xs font-medium text-slate-400">/ {day.lowC}°</span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 mt-0.5 truncate">
                    {day.condition}
                  </div>
                </div>

                {day.rainChance > 0 && (
                  <div className="text-[10px] font-bold text-sky-600 bg-sky-50 py-0.5 rounded-full flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3" />
                    <span>{day.rainChance}% rain</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Weather Impact on Itinerary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <Umbrella className="w-4 h-4 text-sky-600" />
            <h4 className="text-sm font-bold text-slate-900">Weather-Optimized Scheduling</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The itinerary schedules outdoor walking tours and viewpoints on days with optimal visibility, reserving indoor museum explorations or covered markets for overcast afternoons.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm font-bold text-slate-900">Seasonal Travel Pro-Tip</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Carry a compact 2-ounce pocket umbrella and a packable windbreaker. Morning temperatures tend to be 6-8°C cooler than midday highs.
          </p>
        </div>
      </div>

    </div>
  );
};
