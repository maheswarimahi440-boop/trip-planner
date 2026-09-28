import React, { useState } from 'react';
import { 
  Plane, 
  Train, 
  Bus, 
  Car, 
  Check, 
  Clock, 
  DollarSign, 
  Navigation, 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  Plus, 
  Info,
  MapPin
} from 'lucide-react';
import { TripPlan, TransportationOption, TransportType } from '../types/trip';

interface TransportationPlannerProps {
  trip: TripPlan;
  onUpdateTrip: (updatedTrip: TripPlan) => void;
}

export const TransportationPlanner: React.FC<TransportationPlannerProps> = ({
  trip,
  onUpdateTrip
}) => {
  const [selectedId, setSelectedId] = useState<string>(
    trip.transportationOptions.find(t => t.isPreferred)?.id || trip.transportationOptions[0]?.id || ''
  );
  const [bookingRefInput, setBookingRefInput] = useState<string>('');

  const currency = trip.currency || 'USD';

  const handleSelectPreferred = (optId: string) => {
    setSelectedId(optId);
    const updatedOptions = trip.transportationOptions.map(opt => ({
      ...opt,
      isPreferred: opt.id === optId
    }));
    
    // Also update preferred transport in budget if cost changed
    const chosen = updatedOptions.find(o => o.id === optId);
    let updatedTrip = {
      ...trip,
      transportationOptions: updatedOptions
    };

    if (chosen && trip.budgetBreakdown?.categories?.transportation) {
      updatedTrip = {
        ...updatedTrip,
        budgetBreakdown: {
          ...trip.budgetBreakdown,
          categories: {
            ...trip.budgetBreakdown.categories,
            transportation: {
              ...trip.budgetBreakdown.categories.transportation,
              planned: chosen.estimatedCost
            }
          }
        }
      };
    }

    onUpdateTrip(updatedTrip);
  };

  const handleSaveBookingRef = (optId: string) => {
    if (!bookingRefInput.trim()) return;
    const updatedOptions = trip.transportationOptions.map(opt => 
      opt.id === optId ? { ...opt, bookingRef: bookingRefInput.trim() } : opt
    );
    onUpdateTrip({
      ...trip,
      transportationOptions: updatedOptions
    });
    setBookingRefInput('');
  };

  const getTransportIcon = (type: TransportType) => {
    switch (type) {
      case 'Train': return Train;
      case 'Car': return Car;
      case 'Bus': return Bus;
      default: return Plane;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Route Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-sky-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 bg-sky-950/70 border border-sky-700/60 px-2.5 py-1 rounded-full">
              Intercity Journey Logistics
            </span>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xl sm:text-2xl font-black">{trip.startingLocation}</span>
              <ArrowRight className="w-5 h-5 text-sky-400 shrink-0" />
              <span className="text-xl sm:text-2xl font-black text-sky-300">{trip.destination}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Compare transit methods, airport-to-city transfers, and select your preferred travel mode.
            </p>
          </div>

          <div className="shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center min-w-[170px]">
            <div className="text-[10px] uppercase font-bold text-sky-300">Transportation Budget</div>
            <div className="text-2xl font-black text-white mt-0.5">
              {trip.budgetBreakdown?.categories?.transportation?.estimated.toLocaleString()} {currency}
            </div>
            <div className="text-[11px] text-slate-300 mt-0.5">Estimated Allocation</div>
          </div>
        </div>
      </div>

      {/* Options Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Plane className="w-5 h-5 text-sky-600" />
            Available Transportation Routes ({trip.transportationOptions.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trip.transportationOptions.map((opt) => {
            const Icon = getTransportIcon(opt.type);
            const isSelected = opt.isPreferred;

            return (
              <div
                key={opt.id}
                className={`rounded-2xl p-5 border transition-all relative ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/40 shadow-md ring-2 ring-sky-500/20'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Preferred Badge */}
                {isSelected && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold text-sky-700 bg-sky-100 border border-sky-300/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" /> Active Selection
                  </span>
                )}

                <div className="flex items-start gap-3.5 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div className="pr-16">
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{opt.title}</h4>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{opt.provider}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block">Travel Duration</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {opt.duration}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Estimated Cost</span>
                    <span className="font-black text-slate-900 text-sm mt-0.5 block">
                      {opt.estimatedCost.toLocaleString()} {currency}
                    </span>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                    <span>{opt.details}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Navigation className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Transfer:</strong> {opt.localTransfer}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                    <span><strong>Return:</strong> {opt.returnJourney}</span>
                  </div>
                </div>

                {opt.bookingRef && (
                  <div className="mt-3 p-2 rounded-xl bg-slate-100/80 border border-slate-200 text-xs flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Booking / Confirmation #</span>
                    <span className="font-mono font-bold text-slate-900">{opt.bookingRef}</span>
                  </div>
                )}

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  {!isSelected ? (
                    <button
                      onClick={() => handleSelectPreferred(opt.id)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      Select Preferred Option
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-sky-700 flex items-center gap-1">
                      <Check className="w-4 h-4 text-sky-600" /> Itinerary & Budget Synced
                    </span>
                  )}

                  {!opt.bookingRef && (
                    <div className="flex items-center gap-1.5 flex-1 max-w-[200px]">
                      <input
                        type="text"
                        placeholder="Ref # (e.g. NH871)"
                        value={bookingRefInput}
                        onChange={(e) => setBookingRefInput(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg text-slate-800"
                      />
                      <button
                        onClick={() => handleSaveBookingRef(opt.id)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold"
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Local Transportation Guide & Transfers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-teal-600" />
            <h4 className="text-sm font-bold text-slate-900">Local Transit Pass Guide</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Upon reaching {trip.destination}, purchase a reloadable transit card (or digital mobile pass) for seamless rides across subways, trams, and urban buses.
          </p>
          <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/60 text-xs text-teal-900 font-medium">
            💡 Estimated Local Transit: {trip.budgetBreakdown?.categories?.localTransport?.estimated || 100} {currency} covers all metro rides and airport transfers.
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-600" />
            <h4 className="text-sm font-bold text-slate-900">Airport & Station Transfers</h4>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {trip.transportationOptions?.[0]?.localTransfer || `Direct train and bus connections connect the airport to downtown ${trip.destination} in 25-40 minutes.`}
          </p>
          <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200/60 text-xs text-sky-900 font-medium">
            ✈️ Return Journey Tip: Arrive at the departure airport 3 hours prior to international flights.
          </div>
        </div>

      </div>

    </div>
  );
};
