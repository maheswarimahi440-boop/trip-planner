import React from 'react';
import { 
  UtensilsCrossed, 
  DollarSign, 
  MapPin, 
  Sparkles, 
  Info, 
  Star, 
  Coffee, 
  Wine,
  HeartHandshake
} from 'lucide-react';
import { TripPlan } from '../types/trip';

interface FoodPlannerProps {
  trip: TripPlan;
}

export const FoodPlanner: React.FC<FoodPlannerProps> = ({ trip }) => {
  const currency = trip.currency || 'USD';
  const foodGuide = trip.foodGuide || {
    foodPreference: 'Balanced & Local',
    dailyFoodBudgetEstimate: 45,
    signatureDishes: [],
    diningTips: 'Round up bills by 5-10% for good service.',
    recommendedSpots: []
  };

  const dailyFoodBudget = foodGuide.dailyFoodBudgetEstimate || Math.round((trip.budgetBreakdown?.categories?.food?.estimated || 400) / trip.durationDays);
  const totalFoodBudget = dailyFoodBudget * trip.durationDays;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-orange-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-300 bg-orange-950/70 border border-orange-700/60 px-2.5 py-1 rounded-full">
            Gastronomy & Culinary Guide
          </span>
          <h2 className="text-xl sm:text-2xl font-black">
            {trip.destination} Food & Dining Planner
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Curated dishes, authentic street markets, and dining etiquette tailored for your <strong>{foodGuide.foodPreference}</strong> preference.
          </p>
        </div>

        {/* Daily Food Budget Estimate Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-white min-w-[240px] text-center space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-orange-300">
            Daily Dining Budget
          </div>
          <div className="text-3xl font-black text-white">
            ~{dailyFoodBudget} <span className="text-xs font-semibold text-orange-300">{currency} / day</span>
          </div>
          <div className="text-xs text-slate-300">
            Total {trip.durationDays}-Day Food Allocation: {totalFoodBudget.toLocaleString()} {currency}
          </div>
        </div>
      </div>

      {/* Signature Dishes of Destination */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-600" />
          <h3 className="text-base font-bold text-slate-900">
            Must-Try Signature Dishes ({foodGuide.signatureDishes.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foodGuide.signatureDishes.map((dish, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-orange-300 hover:shadow-md transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-slate-900">{dish.name}</h4>
                <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md">
                  {dish.priceRange}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {dish.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Restaurants & Markets */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-orange-600" />
          <h3 className="text-base font-bold text-slate-900">
            Curated Dining Spots in {trip.destination}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {foodGuide.recommendedSpots.map((spot, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-orange-300 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {spot.type}
                </span>
                <span className="text-xs font-bold text-emerald-700">{spot.price}</span>
              </div>
              <h4 className="text-base font-bold text-slate-900">{spot.name}</h4>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{spot.neighborhood}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dining Etiquette & Tipping Customs */}
      <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-200/60 shadow-2xs space-y-2">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-orange-700" />
          <h3 className="text-sm font-bold text-orange-950">Dining Etiquette & Tipping Customs</h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {foodGuide.diningTips}
        </p>
      </div>

    </div>
  );
};
