import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Navigation, 
  Utensils, 
  Coffee, 
  Sun, 
  Sunset, 
  Moon, 
  Check, 
  Plus, 
  Sparkles, 
  ExternalLink,
  Info
} from 'lucide-react';
import { TripPlan, DayPlan, ActivityDetail } from '../types/trip';

interface DailyItineraryViewProps {
  trip: TripPlan;
  onUpdateTrip: (updatedTrip: TripPlan) => void;
}

export const DailyItineraryView: React.FC<DailyItineraryViewProps> = ({
  trip,
  onUpdateTrip
}) => {
  const [activeDayNumber, setActiveDayNumber] = useState(1);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [customTime, setCustomTime] = useState('03:30 PM');
  const [customName, setCustomName] = useState('');
  const [customLoc, setCustomLoc] = useState('');
  const [customCost, setCustomCost] = useState<number | ''>(15);
  const [customTips, setCustomTips] = useState('');
  const [customSlot, setCustomSlot] = useState<'morning' | 'afternoon' | 'evening'>('afternoon');

  const currency = trip.currency || 'USD';
  const currentDay = trip.itinerary.find(d => d.dayNumber === activeDayNumber) || trip.itinerary[0];

  const handleToggleCompleted = (slot: 'morning' | 'afternoon' | 'evening') => {
    if (!currentDay) return;
    const isCompleted = currentDay[slot]?.completed;
    const updatedItinerary = trip.itinerary.map(d => {
      if (d.dayNumber === activeDayNumber) {
        return {
          ...d,
          [slot]: {
            ...d[slot],
            completed: !isCompleted
          }
        };
      }
      return d;
    });

    onUpdateTrip({
      ...trip,
      itinerary: updatedItinerary
    });
  };

  const handleAddCustomActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !currentDay) return;

    const newActivity: ActivityDetail = {
      time: customTime,
      activity: customName.trim(),
      location: customLoc.trim() || trip.destination,
      coordinates: currentDay.morning.coordinates,
      cost: Number(customCost) || 0,
      tips: customTips.trim() || 'Custom planned activity',
      completed: false
    };

    const updatedItinerary = trip.itinerary.map(d => {
      if (d.dayNumber === activeDayNumber) {
        return {
          ...d,
          [customSlot]: newActivity
        };
      }
      return d;
    });

    onUpdateTrip({
      ...trip,
      itinerary: updatedItinerary
    });

    setCustomName('');
    setCustomLoc('');
    setCustomTips('');
    setShowAddActivityModal(false);
  };

  if (!currentDay) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Day Selector Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Curated Day-by-Day Itinerary
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Thoughtfully paced schedule designed to minimize transit exhaustion while maximizing cultural discovery.
          </p>
        </div>

        <button
          onClick={() => setShowAddActivityModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Activity to Day {activeDayNumber}
        </button>
      </div>

      {/* Horizontal Day Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {trip.itinerary.map((day) => {
          const isSelected = day.dayNumber === activeDayNumber;
          return (
            <button
              key={day.dayNumber}
              onClick={() => setActiveDayNumber(day.dayNumber)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80 shadow-2xs'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                isSelected ? 'bg-teal-400 text-slate-950' : 'bg-slate-100 text-slate-600'
              }`}>
                {day.dayNumber}
              </span>
              <span>Day {day.dayNumber}</span>
              <span className="text-[11px] font-normal opacity-70 hidden sm:inline">· {day.area}</span>
            </button>
          );
        })}
      </div>

      {/* Day Overview Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-300 mb-1">
            <span className="bg-teal-950/80 border border-teal-700/60 px-2.5 py-0.5 rounded-full">
              Day {currentDay.dayNumber} of {trip.durationDays}
            </span>
            <span>·</span>
            <span>{currentDay.area}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">{currentDay.title}</h3>
          <p className="text-xs text-slate-300 mt-1 italic">Theme: {currentDay.theme}</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-right shrink-0">
          <div className="text-[10px] uppercase font-bold text-teal-300">Estimated Day Cost</div>
          <div className="text-xl font-black text-white mt-0.5">
            {currentDay.estimatedDayCost.toLocaleString()} {currency}
          </div>
          <div className="text-[10px] text-slate-300">Includes activities & dining</div>
        </div>
      </div>

      {/* Day Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        
        {/* Morning Slot */}
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-amber-100 border-2 border-white text-amber-700 flex items-center justify-center shadow-xs">
            <Sun className="w-3.5 h-3.5" />
          </div>

          <div className={`bg-white rounded-2xl p-5 border transition-all ${
            currentDay.morning.completed ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200/80 shadow-xs'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                    Morning · {currentDay.morning.time}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {currentDay.morning.location}
                  </span>
                </div>
                <h4 className={`text-base font-bold text-slate-900 ${currentDay.morning.completed ? 'line-through text-slate-400' : ''}`}>
                  {currentDay.morning.activity}
                </h4>
                <p className="text-xs text-slate-600">
                  💡 <strong>Insider Tip:</strong> {currentDay.morning.tips}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-slate-700">
                  {currentDay.morning.cost > 0 ? `${currentDay.morning.cost} ${currency}` : 'Free Entry'}
                </span>
                <button
                  onClick={() => handleToggleCompleted('morning')}
                  className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all ${
                    currentDay.morning.completed
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-200 hover:border-slate-300 text-transparent hover:text-slate-300'
                  }`}
                  title="Mark activity completed"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Breakfast Spot */}
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-orange-100 border-2 border-white text-orange-700 flex items-center justify-center shadow-xs">
            <Coffee className="w-3.5 h-3.5" />
          </div>

          <div className="bg-orange-50/40 rounded-2xl p-4 border border-orange-200/60 shadow-2xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">🥐</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 block">
                  Morning Breakfast & Coffee
                </span>
                <span className="text-sm font-bold text-slate-900">{currentDay.breakfast.name}</span>
                <span className="text-xs text-slate-600 block">Specialty: {currentDay.breakfast.specialty}</span>
              </div>
            </div>
            <div className="text-xs font-bold text-orange-950 shrink-0">
              ~{currentDay.breakfast.estimatedCost} {currency}
            </div>
          </div>
        </div>

        {/* Lunch Spot */}
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-teal-100 border-2 border-white text-teal-700 flex items-center justify-center shadow-xs">
            <Utensils className="w-3.5 h-3.5" />
          </div>

          <div className="bg-teal-50/40 rounded-2xl p-4 border border-teal-200/60 shadow-2xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">🍲</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
                  Midday Lunch Recommendation
                </span>
                <span className="text-sm font-bold text-slate-900">{currentDay.lunch.name}</span>
                <span className="text-xs text-slate-600 block">Dish: {currentDay.lunch.specialty}</span>
              </div>
            </div>
            <div className="text-xs font-bold text-teal-950 shrink-0">
              ~{currentDay.lunch.estimatedCost} {currency}
            </div>
          </div>
        </div>

        {/* Afternoon Slot */}
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-indigo-100 border-2 border-white text-indigo-700 flex items-center justify-center shadow-xs">
            <Sun className="w-3.5 h-3.5" />
          </div>

          <div className={`bg-white rounded-2xl p-5 border transition-all ${
            currentDay.afternoon.completed ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200/80 shadow-xs'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    Afternoon · {currentDay.afternoon.time}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {currentDay.afternoon.location}
                  </span>
                </div>
                <h4 className={`text-base font-bold text-slate-900 ${currentDay.afternoon.completed ? 'line-through text-slate-400' : ''}`}>
                  {currentDay.afternoon.activity}
                </h4>
                <p className="text-xs text-slate-600">
                  💡 <strong>Insider Tip:</strong> {currentDay.afternoon.tips}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-slate-700">
                  {currentDay.afternoon.cost > 0 ? `${currentDay.afternoon.cost} ${currency}` : 'Free Entry'}
                </span>
                <button
                  onClick={() => handleToggleCompleted('afternoon')}
                  className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all ${
                    currentDay.afternoon.completed
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-200 hover:border-slate-300 text-transparent hover:text-slate-300'
                  }`}
                  title="Mark activity completed"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Evening Slot */}
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-violet-100 border-2 border-white text-violet-700 flex items-center justify-center shadow-xs">
            <Sunset className="w-3.5 h-3.5" />
          </div>

          <div className={`bg-white rounded-2xl p-5 border transition-all ${
            currentDay.evening.completed ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200/80 shadow-xs'
          }`}>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">
                    Evening · {currentDay.evening.time}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {currentDay.evening.location}
                  </span>
                </div>
                <h4 className={`text-base font-bold text-slate-900 ${currentDay.evening.completed ? 'line-through text-slate-400' : ''}`}>
                  {currentDay.evening.activity}
                </h4>
                <p className="text-xs text-slate-600">
                  💡 <strong>Insider Tip:</strong> {currentDay.evening.tips}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-slate-700">
                  {currentDay.evening.cost > 0 ? `${currentDay.evening.cost} ${currency}` : 'Free'}
                </span>
                <button
                  onClick={() => handleToggleCompleted('evening')}
                  className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-all ${
                    currentDay.evening.completed
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-200 hover:border-slate-300 text-transparent hover:text-slate-300'
                  }`}
                  title="Mark activity completed"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dinner Spot */}
        <div className="relative group">
          <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full bg-slate-800 border-2 border-white text-white flex items-center justify-center shadow-xs">
            <Moon className="w-3.5 h-3.5" />
          </div>

          <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xl">🍷</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300 block">
                  Dinner Experience
                </span>
                <span className="text-sm font-bold text-white">{currentDay.dinner.name}</span>
                <span className="text-xs text-slate-300 block">Specialty: {currentDay.dinner.specialty}</span>
              </div>
            </div>
            <div className="text-xs font-bold text-teal-300 shrink-0">
              ~{currentDay.dinner.estimatedCost} {currency}
            </div>
          </div>
        </div>

      </div>

      {/* Transit Logistics Note for This Day */}
      <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200/80 flex items-start gap-3 text-xs text-slate-700">
        <Navigation className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900">Day {currentDay.dayNumber} Travel & Transit Notes:</span>
          <p>{currentDay.transitNotes}</p>
          <span className="text-slate-500 font-semibold block pt-0.5">
            Est. Local Transit Cost for today: {currentDay.estimatedLocalTransitCost} {currency}
          </span>
        </div>
      </div>

      {/* Add Custom Activity Modal */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-600" />
                Add Activity to Day {activeDayNumber}
              </h3>
              <button
                onClick={() => setShowAddActivityModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomActivity} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Time Slot to Update
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['morning', 'afternoon', 'evening'] as const).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setCustomSlot(slot)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold capitalize transition-all ${
                        customSlot === slot
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Activity Name *
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Guided Canal Cruise, Vintage Flea Market..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    placeholder="03:00 PM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Cost ({currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={customCost}
                    onChange={(e) => setCustomCost(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={customLoc}
                  onChange={(e) => setCustomLoc(e.target.value)}
                  placeholder="Specific landmark or neighborhood"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tips or Notes
                </label>
                <input
                  type="text"
                  value={customTips}
                  onChange={(e) => setCustomTips(e.target.value)}
                  placeholder="e.g. Bring student ID for discount, arrive early"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
