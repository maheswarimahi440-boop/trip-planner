import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  Users, 
  DollarSign, 
  MapPin, 
  Star, 
  Check, 
  Wifi, 
  Coffee, 
  Waves, 
  ShieldCheck, 
  Plus, 
  Sparkles,
  BedDouble
} from 'lucide-react';
import { TripPlan, HotelOption } from '../types/trip';

interface HotelPlannerProps {
  trip: TripPlan;
  onUpdateTrip: (updatedTrip: TripPlan) => void;
}

export const HotelPlanner: React.FC<HotelPlannerProps> = ({
  trip,
  onUpdateTrip
}) => {
  const [checkIn, setCheckIn] = useState(trip.startDate || new Date().toISOString().slice(0, 10));
  const [checkOut, setCheckOut] = useState(trip.endDate || new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10));
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(trip.travelers || 2);
  const [confirmationCode, setConfirmationCode] = useState('');

  const currency = trip.currency || 'USD';
  const totalNights = Math.max(1, trip.durationDays - 1);

  // Selected hotel
  const selectedHotel = trip.hotelOptions.find(h => h.isSelected) || trip.hotelOptions[0];
  const costPerNight = selectedHotel ? selectedHotel.costPerNight : 180;
  const totalAccommodationCost = costPerNight * totalNights * rooms;

  const handleSelectHotel = (hotelId: string) => {
    const updatedHotels = trip.hotelOptions.map(h => ({
      ...h,
      isSelected: h.id === hotelId
    }));

    const newlySelected = updatedHotels.find(h => h.id === hotelId);
    const newTotal = (newlySelected?.costPerNight || costPerNight) * totalNights * rooms;

    let updatedTrip = {
      ...trip,
      hotelOptions: updatedHotels
    };

    if (trip.budgetBreakdown?.categories?.hotels) {
      updatedTrip = {
        ...updatedTrip,
        budgetBreakdown: {
          ...trip.budgetBreakdown,
          categories: {
            ...trip.budgetBreakdown.categories,
            hotels: {
              ...trip.budgetBreakdown.categories.hotels,
              planned: newTotal
            }
          }
        }
      };
    }

    onUpdateTrip(updatedTrip);
  };

  const handleSaveConfirmation = (hotelId: string) => {
    if (!confirmationCode.trim()) return;
    const updatedHotels = trip.hotelOptions.map(h => 
      h.id === hotelId ? { ...h, bookingConfirmation: confirmationCode.trim() } : h
    );
    onUpdateTrip({
      ...trip,
      hotelOptions: updatedHotels
    });
    setConfirmationCode('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Hotel Planner Banner */}
      <div className="bg-gradient-to-r from-violet-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-violet-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300 bg-violet-900/60 border border-violet-700/60 px-2.5 py-1 rounded-full">
              Accommodations & Lodging Hub
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              {trip.destination} Hotel Planner
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Calculate total stay costs, customize room counts, and explore curated boutique hotels matching your travel style.
            </p>
          </div>

          {/* Real-time Accommodation Cost Calculator */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-white min-w-[260px] space-y-2">
            <div className="text-[11px] uppercase font-bold text-violet-300 flex items-center justify-between">
              <span>Stay Cost Breakdown</span>
              <span className="font-bold">{totalNights} Nights</span>
            </div>

            <div className="text-xs text-slate-200 flex justify-between">
              <span>{costPerNight} {currency} × {totalNights} nights × {rooms} rm</span>
            </div>

            <div className="border-t border-white/15 pt-2 flex items-baseline justify-between">
              <span className="text-xs font-semibold text-slate-300">Total Stay:</span>
              <span className="text-2xl font-black text-white">
                {totalAccommodationCost.toLocaleString()} <span className="text-xs font-medium text-violet-300">{currency}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Parameters Form */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-violet-600" />
          Stay Parameters & Requirements
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Check-in Date</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Check-out Date</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Number of Rooms</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRooms(Math.max(1, rooms - 1))}
                className="w-8 h-8 rounded-lg border border-slate-200 font-bold hover:bg-slate-100 flex items-center justify-center text-slate-700"
              >
                -
              </button>
              <span className="font-bold text-slate-900 text-sm w-6 text-center">{rooms}</span>
              <button
                type="button"
                onClick={() => setRooms(Math.min(5, rooms + 1))}
                className="w-8 h-8 rounded-lg border border-slate-200 font-bold hover:bg-slate-100 flex items-center justify-center text-slate-700"
              >
                +
              </button>
              <span className="text-xs text-slate-400 ml-1">Room{rooms > 1 ? 's' : ''}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Guests</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-8 h-8 rounded-lg border border-slate-200 font-bold hover:bg-slate-100 flex items-center justify-center text-slate-700"
              >
                -
              </button>
              <span className="font-bold text-slate-900 text-sm w-6 text-center">{guests}</span>
              <button
                type="button"
                onClick={() => setGuests(Math.min(10, guests + 1))}
                className="w-8 h-8 rounded-lg border border-slate-200 font-bold hover:bg-slate-100 flex items-center justify-center text-slate-700"
              >
                +
              </button>
              <span className="text-xs text-slate-400 ml-1">Guest{guests > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Curated Lodging Options */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BedDouble className="w-5 h-5 text-violet-600" />
          Curated Accommodations in {trip.destination}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trip.hotelOptions.map((hotel) => {
            const isSelected = hotel.isSelected;
            const hotelStayTotal = hotel.costPerNight * totalNights * rooms;

            return (
              <div
                key={hotel.id}
                className={`rounded-2xl p-5 border transition-all relative ${
                  isSelected
                    ? 'border-violet-500 bg-violet-50/40 shadow-md ring-2 ring-violet-500/20'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Active Selection Badge */}
                {isSelected && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold text-violet-700 bg-violet-100 border border-violet-300/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" /> Active Selection
                  </span>
                )}

                <div className="pr-16">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-violet-800 bg-violet-100/70 px-2 py-0.5 rounded-md">
                      {hotel.type}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                      {hotel.rating}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{hotel.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{hotel.location}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {hotel.description}
                </p>

                {/* Amenities Badges */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {hotel.amenities.map((am, i) => (
                    <span key={i} className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      ✓ {am}
                    </span>
                  ))}
                </div>

                {/* Cost Row */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Rate per night</span>
                    <span className="text-lg font-black text-slate-900">
                      {hotel.costPerNight} <span className="text-xs font-semibold text-slate-500">{currency} / night</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">{totalNights} nights total</span>
                    <span className="text-sm font-bold text-violet-700">
                      {hotelStayTotal.toLocaleString()} {currency}
                    </span>
                  </div>
                </div>

                {/* Confirmation Code */}
                {hotel.bookingConfirmation && (
                  <div className="mt-3 p-2 rounded-xl bg-violet-50 border border-violet-100 text-xs flex items-center justify-between">
                    <span className="text-violet-700 font-medium">Confirmation Voucher</span>
                    <span className="font-mono font-bold text-violet-900">{hotel.bookingConfirmation}</span>
                  </div>
                )}

                {/* Selection Action */}
                <div className="mt-4 pt-2 flex items-center justify-between gap-3">
                  {!isSelected ? (
                    <button
                      onClick={() => handleSelectHotel(hotel.id)}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
                    >
                      Choose This Hotel
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-violet-700 flex items-center gap-1">
                      <Check className="w-4 h-4 text-violet-600" /> Accommodation Synced to Budget
                    </span>
                  )}

                  {!hotel.bookingConfirmation && (
                    <div className="flex items-center gap-1.5 flex-1 max-w-[200px]">
                      <input
                        type="text"
                        placeholder="Voucher # (e.g. HTL-948)"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                        className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg text-slate-800"
                      />
                      <button
                        onClick={() => handleSaveConfirmation(hotel.id)}
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

    </div>
  );
};
