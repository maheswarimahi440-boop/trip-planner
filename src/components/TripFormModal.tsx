import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Compass, 
  Plane, 
  Building2, 
  Utensils, 
  Check, 
  Flame,
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { TripUserInput, TravelStyle, TransportType, HotelPreference, FoodPreference } from '../types/trip';

interface TripFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: TripUserInput) => Promise<void>;
  isLoading: boolean;
}

const POPULAR_DESTINATIONS = [
  { city: 'Tokyo', country: 'Japan', tag: 'Neon & Culture' },
  { city: 'Paris', country: 'France', tag: 'Art & Boulevards' },
  { city: 'Rome', country: 'Italy', tag: 'Ancient Wonders' },
  { city: 'Bali', country: 'Indonesia', tag: 'Tropical Serenity' },
  { city: 'Kyoto', country: 'Japan', tag: 'Temples & Gardens' },
  { city: 'Barcelona', country: 'Spain', tag: 'Architecture & Beach' },
  { city: 'Zurich', country: 'Switzerland', tag: 'Alps & Scenic Rail' },
  { city: 'New York', country: 'USA', tag: 'Skyline & Broadway' }
];

const ACTIVITY_OPTIONS = [
  'Culture & History',
  'Art & Museums',
  'Culinary & Wine',
  'Nature & Hiking',
  'Beaches & Relaxation',
  'Shopping & Boutiques',
  'Nightlife & Social',
  'Photography & Architecture',
  'Wellness & Spas',
  'Hidden Local Gems'
];

export const TripFormModal: React.FC<TripFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [destination, setDestination] = useState('');
  const [startingLocation, setStartingLocation] = useState('San Francisco (SFO)');
  const [durationDays, setDurationDays] = useState(5);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [budget, setBudget] = useState(3000);
  const [currency, setCurrency] = useState('USD');
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('Standard');
  const [preferredTransport, setPreferredTransport] = useState<TransportType>('Flight');
  const [hotelPreference, setHotelPreference] = useState<HotelPreference>('Boutique Hotel');
  const [foodPreference, setFoodPreference] = useState<FoodPreference>('Balanced & Local');
  const [activities, setActivities] = useState<string[]>([
    'Culture & History',
    'Culinary & Wine',
    'Photography & Architecture'
  ]);
  const [mustVisit, setMustVisit] = useState('');
  const [avoidPlaces, setAvoidPlaces] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');

  if (!isOpen) return null;

  const handleToggleActivity = (act: string) => {
    if (activities.includes(act)) {
      setActivities(activities.filter(a => a !== act));
    } else {
      setActivities([...activities, act]);
    }
  };

  const handlePickPopular = (dest: string) => {
    setDestination(dest);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setStep(1);
      return;
    }

    const inputData: TripUserInput = {
      destination: destination.trim(),
      startingLocation: startingLocation.trim() || 'Departure City',
      durationDays: Number(durationDays),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      travelers: Number(adults) + Number(children),
      adults: Number(adults),
      children: Number(children),
      budget: Number(budget),
      currency,
      travelStyle,
      preferredTransport,
      hotelPreference,
      foodPreference,
      activities,
      mustVisit: mustVisit.trim(),
      avoidPlaces: avoidPlaces.trim(),
      specialRequirements: specialRequirements.trim()
    };

    await onSubmit(inputData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Plan Your Journey with AI</h2>
              <p className="text-xs text-slate-300">Customized itineraries, logistics, budgeting & packing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Tabs */}
        <div className="px-6 pt-3 pb-2 border-b border-slate-100 flex items-center justify-between text-xs font-semibold shrink-0 bg-slate-50/60">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors ${
              step === 1 ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">1</span>
            Destination & Dates
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors ${
              step === 2 ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">2</span>
            Budget & Travel Style
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`flex items-center gap-1.5 pb-1 border-b-2 transition-colors ${
              step === 3 ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">3</span>
            Interests & Preferences
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          
          {/* STEP 1: Destination & Dates */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Destination Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Where do you want to go? *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-teal-600" />
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g. Tokyo, Paris, Rome, Bali, Zurich..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 shadow-2xs font-medium"
                  />
                </div>

                {/* Popular Destinations Quick Select */}
                <div className="mt-2.5">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Popular Quick Picks:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_DESTINATIONS.map((pop) => (
                      <button
                        key={pop.city}
                        type="button"
                        onClick={() => handlePickPopular(pop.city)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                          destination.toLowerCase() === pop.city.toLowerCase()
                            ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {pop.city}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Starting Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Starting / Departure Location
                </label>
                <div className="relative">
                  <Plane className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={startingLocation}
                    onChange={(e) => setStartingLocation(e.target.value)}
                    placeholder="e.g. San Francisco (SFO), London (LHR), New York..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Trip Duration & Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Trip Duration (Days)
                    </label>
                    <span className="text-sm font-bold text-teal-700">{durationDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="14"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                    <span>1 day</span>
                    <span>5 days</span>
                    <span>10 days</span>
                    <span>14 days</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Travel Dates (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Number of Travelers & Breakdown */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Who is Traveling?</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Adults (18+)</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-900 w-6 text-center">{adults}</span>
                      <button
                        type="button"
                        onClick={() => setAdults(Math.min(10, adults + 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-600 block mb-1">Children (0-17)</label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-900 w-6 text-center">{children}</span>
                      <button
                        type="button"
                        onClick={() => setChildren(Math.min(6, children + 1))}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: Budget & Style */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Total Budget & Currency */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Total Trip Budget
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      min="300"
                      step="50"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                    />
                  </div>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-28 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="CAD">CAD ($)</option>
                    <option value="AUD">AUD ($)</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Covers all travelers for transport, accommodations, meals, entry tickets, and contingency.
                </p>
              </div>

              {/* Travel Style */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Travel Style
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['Budget', 'Standard', 'Luxury'] as TravelStyle[]).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setTravelStyle(style)}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        travelStyle === style
                          ? 'border-teal-600 bg-teal-50/80 text-teal-900 font-bold shadow-xs ring-1 ring-teal-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="text-sm">{style}</div>
                      <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                        {style === 'Budget' ? 'Hostels & Street Eats' : style === 'Standard' ? 'Boutique & Balanced' : '5-Star & Fine Dining'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Transport */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Preferred Transport
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Flight', 'Train', 'Car', 'Bus'] as TransportType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setPreferredTransport(t)}
                      className={`px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                        preferredTransport === t
                          ? 'bg-sky-50 border-sky-500 text-sky-800 font-bold'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hotel Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Hotel / Lodging Preference
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Boutique Hotel', 'Luxury Resort', 'Central 4-Star', 'Cozy Airbnb', 'Budget Hostel', 'Eco-Lodge'] as HotelPreference[]).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHotelPreference(h)}
                      className={`px-3 py-2 rounded-xl border text-xs text-left transition-all ${
                        hotelPreference === h
                          ? 'bg-violet-50 border-violet-500 text-violet-900 font-bold'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Food Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Food & Dining Preference
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Balanced & Local', 'Street Food & Markets', 'Fine Dining & Michelin', 'Vegetarian & Vegan', 'Halal', 'Gluten-Free'] as FoodPreference[]).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFoodPreference(f)}
                      className={`px-3 py-2 rounded-xl border text-xs text-left transition-all ${
                        foodPreference === f
                          ? 'bg-orange-50 border-orange-500 text-orange-900 font-bold'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: Activities & Special Requirements */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Activity Multi-Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Activities & Passions
                </label>
                <div className="flex flex-wrap gap-2">
                  {ACTIVITY_OPTIONS.map((act) => {
                    const isSelected = activities.includes(act);
                    return (
                      <button
                        key={act}
                        type="button"
                        onClick={() => handleToggleActivity(act)}
                        className={`text-xs px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 font-semibold shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        {act}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Places they definitely want to visit */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Places You Definitely Want to Visit (Must-Sees)
                </label>
                <input
                  type="text"
                  value={mustVisit}
                  onChange={(e) => setMustVisit(e.target.value)}
                  placeholder="e.g. Louvre Museum, Eiffel Tower, Mount Fuji, teamLab..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>

              {/* Places to Avoid */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Places or Vibes You Want to Avoid
                </label>
                <input
                  type="text"
                  value={avoidPlaces}
                  onChange={(e) => setAvoidPlaces(e.target.value)}
                  placeholder="e.g. Extreme crowds, intense mountain hikes, high-altitude climbs..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>

              {/* Special Requirements */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Special Requirements or Accessibility
                </label>
                <textarea
                  rows={2}
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  placeholder="e.g. Elevator access needed, traveling with toddler stroller, strict peanut allergy..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 custom-scrollbar"
                />
              </div>

            </div>
          )}

        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                disabled={isLoading}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !destination.trim()) return;
                  setStep((step + 1) as any);
                }}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || !destination.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-[0.98] text-white text-sm font-bold shadow-md shadow-teal-600/30 transition-all disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Synthesizing Itinerary...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Trip Plan</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
