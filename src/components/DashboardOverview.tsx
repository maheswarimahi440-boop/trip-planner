import React from 'react';
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  TrendingUp, 
  CloudSun, 
  Compass, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Plane,
  Building2,
  Luggage,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { TripPlan } from '../types/trip';
import { ActiveTab } from './CategoryNav';

interface DashboardOverviewProps {
  trip: TripPlan;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenExpenseModal?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  trip,
  onNavigateTab
}) => {
  // Budget calculations
  const totalBudget = trip.budget || 2500;
  const expenses = trip.budgetBreakdown?.expenses || [];
  const totalSpent = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const remainingBudget = Math.max(0, totalBudget - totalSpent);
  const utilizationPct = Math.min(100, Math.round((totalSpent / (totalBudget || 1)) * 100));

  // Upcoming activity (Day 1 morning or afternoon)
  const firstDay = trip.itinerary && trip.itinerary[0];
  const upcomingActivity = firstDay?.morning || {
    time: '09:30 AM',
    activity: `Welcome exploration in ${trip.destination}`,
    location: `${trip.destination} Center`,
    cost: 0,
    tips: 'Pick up transit cards upon arrival'
  };

  // Weather snapshot
  const weather = trip.weatherForecast || {
    summary: 'Mild and pleasant',
    avgTempC: 21,
    avgTempF: 70,
    condition: 'Partly Sunny',
    packingAdvice: 'Light layers recommended'
  };

  // Packing stats
  const packingList = trip.packingList || [];
  const packedCount = packingList.filter(p => p.checked).length;
  const packingPct = packingList.length > 0 ? Math.round((packedCount / packingList.length) * 100) : 0;

  // Documents stats
  const documents = trip.documents || [];
  const readyDocs = documents.filter(d => d.status === 'ready').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Hero Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white shadow-xl shadow-slate-900/15 border border-slate-800">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-teal-300">
              <span className="flex items-center gap-1.5 bg-teal-900/60 border border-teal-700/60 px-2.5 py-1 rounded-full text-teal-200">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                {trip.country || 'Destination'}
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-white/90">
                <Calendar className="w-3.5 h-3.5" />
                {trip.durationDays} Days · {trip.durationDays - 1} Nights
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full text-white/90">
                <Users className="w-3.5 h-3.5" />
                {trip.travelers} Traveler{trip.travelers > 1 ? 's' : ''} ({trip.adults} Adults{trip.children > 0 ? `, ${trip.children} Kids` : ''})
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {trip.title || `Adventure in ${trip.destination}`}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
              {trip.summary || `A tailored travel plan balancing sights, culture, dining, and effortless transit.`}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('itinerary')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-[1.02]"
              >
                <span>View Full Itinerary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigateTab('map')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 transition-colors"
              >
                <Compass className="w-4 h-4 text-teal-300" />
                <span>Explore Interactive Map</span>
              </button>
            </div>
          </div>

          {/* Quick Snapshot Card on Right */}
          <div className="w-full md:w-auto shrink-0 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 text-white flex flex-row md:flex-col justify-between gap-4 min-w-[240px]">
            <div>
              <div className="text-[11px] font-semibold text-teal-300 uppercase tracking-wider mb-1">
                Travel Dates
              </div>
              <div className="text-base font-bold text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-300" />
                <span>{trip.startDate} ➔ {trip.endDate}</span>
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Departing from {trip.startingLocation}
              </div>
            </div>

            <div className="border-t border-white/10 pt-3">
              <div className="text-[11px] font-semibold text-teal-300 uppercase tracking-wider mb-1">
                Style & Transport
              </div>
              <div className="text-sm font-semibold text-white">
                {trip.travelStyle} Style · {trip.transportationOptions?.[0]?.type || 'Flight'}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Budget Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Budget</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {totalBudget.toLocaleString()} <span className="text-xs font-semibold text-slate-400">{trip.currency}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>Estimated total allocation</span>
          </div>
        </div>

        {/* Spent vs Remaining Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Amount Spent</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {totalSpent.toLocaleString()} <span className="text-xs font-semibold text-slate-400">{trip.currency}</span>
          </div>
          <div className="text-xs font-semibold text-teal-700 mt-1">
            {remainingBudget.toLocaleString()} {trip.currency} remaining
          </div>
        </div>

        {/* Budget Utilization Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Budget Utilization</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              utilizationPct > 90 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {utilizationPct}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-3 mb-2">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                utilizationPct > 85 ? 'bg-rose-500' : utilizationPct > 60 ? 'bg-amber-500' : 'bg-teal-500'
              }`}
              style={{ width: `${utilizationPct}%` }}
            />
          </div>
          <div className="text-xs text-slate-500">
            {utilizationPct <= 75 ? 'Paced comfortably on track' : 'Approaching upper threshold'}
          </div>
        </div>

        {/* Weather Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Weather Forecast</span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <CloudSun className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight flex items-baseline gap-1.5">
            <span>{weather.avgTempC}°C</span>
            <span className="text-xs font-semibold text-slate-400">/ {weather.avgTempF}°F</span>
          </div>
          <div className="text-xs text-slate-600 mt-1 truncate font-medium">
            {weather.condition}
          </div>
        </div>

      </div>

      {/* Main 2-Column Split: Upcoming Activity & Weather Impact + Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 spans): Upcoming Activity & Category Shortcuts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Upcoming Activity Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Clock className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Upcoming Highlights · Day 1</h3>
                  <p className="text-xs text-slate-500">{firstDay?.title || 'Arrival & Orientation'}</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('itinerary')}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>View All Days</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                    {upcomingActivity.time}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {upcomingActivity.location}
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {upcomingActivity.activity}
                </div>
                <p className="text-xs text-slate-600">
                  💡 Tip: {upcomingActivity.tips}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-xs text-slate-400">Est. Cost</div>
                <div className="text-sm font-bold text-slate-900">
                  {upcomingActivity.cost > 0 ? `${upcomingActivity.cost} ${trip.currency}` : 'Free'}
                </div>
              </div>
            </div>

            {/* Meals Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="p-3 rounded-xl bg-orange-50/50 border border-orange-100 flex items-center gap-3">
                <span className="text-lg">🥐</span>
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Breakfast Spot</span>
                  <span className="text-slate-600 truncate block">{firstDay?.breakfast?.name}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 flex items-center gap-3">
                <span className="text-lg">🍲</span>
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Lunch Specialty</span>
                  <span className="text-slate-600 truncate block">{firstDay?.lunch?.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Feature Launchers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => onNavigateTab('budget')}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-500/50 hover:shadow-md transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900">Budget Breakdown</div>
              <div className="text-[11px] text-slate-500 mt-0.5">8 Categories</div>
            </button>

            <button
              onClick={() => onNavigateTab('transport')}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-500/50 hover:shadow-md transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Plane className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900">Transport Options</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{trip.transportationOptions?.[0]?.provider || 'Options ready'}</div>
            </button>

            <button
              onClick={() => onNavigateTab('hotel')}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-500/50 hover:shadow-md transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900">Lodging & Hotel</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{trip.hotelOptions?.[0]?.name ? 'Selected' : 'Options'}</div>
            </button>

            <button
              onClick={() => onNavigateTab('packing')}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-500/50 hover:shadow-md transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Luggage className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900">Packing List</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{packedCount}/{packingList.length} packed ({packingPct}%)</div>
            </button>
          </div>

        </div>

        {/* Right Column: Important Reminders & Packing / Safety */}
        <div className="space-y-6">
          
          {/* Important Reminders */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Important Reminders</h3>
            </div>
            
            <div className="space-y-2.5">
              {(trip.reminders || [
                'Download offline maps and translation apps',
                'Notify bank of upcoming travel destinations',
                'Ensure passport has 6+ months remaining validity'
              ]).map((rem, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                  <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{rem}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Readiness Tracker (Docs & Packing) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Trip Readiness</h3>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Packing Progress</span>
                <span className="text-teal-700">{packingPct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full transition-all" style={{ width: `${packingPct}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Documents Verified</span>
                <span className="text-indigo-700">{readyDocs} / {documents.length}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all" 
                  style={{ width: `${documents.length ? (readyDocs / documents.length) * 100 : 0}%` }} 
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Emergency: {trip.safetyAndEmergency?.emergencyPhone || '112'}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
