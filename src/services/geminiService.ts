import { TripPlan, TripUserInput } from '../types/trip';
import { generateProceduralTrip } from './proceduralTripGenerator';
import { DEFAULT_TRIP_TOKYO } from './defaultTrips';

const LOCAL_STORAGE_KEY = 'tripplanner_saved_trips_v1';
const ACTIVE_TRIP_KEY = 'tripplanner_active_trip_id_v1';

export async function generateTripWithAI(input: TripUserInput): Promise<TripPlan> {
  try {
    const res = await fetch('/api/generate-trip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.plan) {
        const p = data.plan;
        // Merge with safe fallbacks
        const completePlan: TripPlan = {
          id: `trip-${Date.now()}`,
          createdAt: new Date().toISOString(),
          title: p.title || `${input.durationDays}-Day Trip to ${input.destination}`,
          destination: input.destination,
          startingLocation: input.startingLocation,
          country: p.country || 'International',
          summary: p.summary || `A personalized ${input.durationDays}-day trip plan.`,
          startDate: input.startDate || new Date().toISOString().slice(0, 10),
          endDate: input.endDate || new Date(Date.now() + (input.durationDays || 5) * 86400000).toISOString().slice(0, 10),
          durationDays: input.durationDays || 5,
          travelers: input.travelers || 2,
          adults: input.adults || 2,
          children: input.children || 0,
          budget: input.budget || 2500,
          currency: input.currency || 'USD',
          travelStyle: input.travelStyle,
          coordinates: p.coordinates || { lat: 35.6762, lng: 139.6503 },
          weatherForecast: p.weatherForecast || {
            summary: 'Mild and pleasant conditions',
            avgTempC: 22,
            avgTempF: 72,
            condition: 'Partly Sunny',
            packingAdvice: 'Layered clothing and walking sneakers',
            daily: []
          },
          budgetBreakdown: p.budgetBreakdown?.categories ? {
            total: input.budget,
            currency: input.currency,
            categories: {
              transportation: {
                estimated: p.budgetBreakdown.categories.transportation?.estimated || Math.round(input.budget * 0.3),
                planned: Math.round(input.budget * 0.3),
                description: p.budgetBreakdown.categories.transportation?.description || 'Transit and flights'
              },
              hotels: {
                estimated: p.budgetBreakdown.categories.hotels?.estimated || Math.round(input.budget * 0.32),
                planned: Math.round(input.budget * 0.32),
                description: p.budgetBreakdown.categories.hotels?.description || 'Accommodations'
              },
              food: {
                estimated: p.budgetBreakdown.categories.food?.estimated || Math.round(input.budget * 0.18),
                planned: Math.round(input.budget * 0.18),
                description: p.budgetBreakdown.categories.food?.description || 'Meals and dining'
              },
              localTransport: {
                estimated: p.budgetBreakdown.categories.localTransport?.estimated || Math.round(input.budget * 0.05),
                planned: Math.round(input.budget * 0.05),
                description: p.budgetBreakdown.categories.localTransport?.description || 'Metro and taxi'
              },
              activities: {
                estimated: p.budgetBreakdown.categories.activities?.estimated || Math.round(input.budget * 0.07),
                planned: Math.round(input.budget * 0.07),
                description: p.budgetBreakdown.categories.activities?.description || 'Tickets and tours'
              },
              shopping: {
                estimated: p.budgetBreakdown.categories.shopping?.estimated || Math.round(input.budget * 0.04),
                planned: Math.round(input.budget * 0.04),
                description: p.budgetBreakdown.categories.shopping?.description || 'Souvenirs'
              },
              emergencyFund: {
                estimated: p.budgetBreakdown.categories.emergencyFund?.estimated || Math.round(input.budget * 0.02),
                planned: Math.round(input.budget * 0.02),
                description: 'Contingency reserve'
              },
              miscellaneous: {
                estimated: p.budgetBreakdown.categories.miscellaneous?.estimated || Math.round(input.budget * 0.02),
                planned: Math.round(input.budget * 0.02),
                description: 'Fees and tips'
              }
            },
            expenses: [
              {
                id: `exp-${Date.now()}-1`,
                category: 'transportation',
                title: `${input.preferredTransport} Tickets`,
                amount: Math.round(input.budget * 0.28),
                date: input.startDate || new Date().toISOString().slice(0, 10),
                notes: 'Main transit tickets'
              }
            ]
          } : generateProceduralTrip(input).budgetBreakdown,
          transportationOptions: p.transportationOptions || generateProceduralTrip(input).transportationOptions,
          hotelOptions: p.hotelOptions || generateProceduralTrip(input).hotelOptions,
          itinerary: p.itinerary || generateProceduralTrip(input).itinerary,
          attractionClusters: p.attractionClusters || generateProceduralTrip(input).attractionClusters,
          packingList: p.packingList || generateProceduralTrip(input).packingList,
          documents: p.documents || generateProceduralTrip(input).documents,
          foodGuide: p.foodGuide || generateProceduralTrip(input).foodGuide,
          safetyAndEmergency: p.safetyAndEmergency || generateProceduralTrip(input).safetyAndEmergency,
          reminders: p.reminders || [
            'Download offline maps and translation packs.',
            'Keep emergency numbers saved.',
            'Notify your bank before traveling.'
          ]
        };
        return completePlan;
      }
    }
  } catch (err) {
    console.warn('Backend AI generation fetch failed; using procedural generator:', err);
  }

  // Fallback to procedural generator
  return generateProceduralTrip(input);
}

export async function askTripCopilot(message: string, trip: TripPlan): Promise<string> {
  try {
    const res = await fetch('/api/chat-assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        tripContext: {
          destination: trip.destination,
          durationDays: trip.durationDays,
          travelers: trip.travelers,
          budget: trip.budget,
          currency: trip.currency,
          travelStyle: trip.travelStyle
        }
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data.reply;
    }
  } catch (e) {
    console.warn('Copilot fetch failed:', e);
  }

  return `For ${trip.destination}, make sure to verify public transit hours, carry some local currency for small vendors, and check reservation times for major attractions. Let me know if you would like me to adjust any specific day's activities!`;
}

// Local Storage helpers
export function getSavedTrips(): TripPlan[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      const initial = [DEFAULT_TRIP_TOKYO];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEFAULT_TRIP_TOKYO];
  } catch {
    return [DEFAULT_TRIP_TOKYO];
  }
}

export function saveTrip(trip: TripPlan): void {
  try {
    const trips = getSavedTrips();
    const index = trips.findIndex(t => t.id === trip.id);
    if (index >= 0) {
      trips[index] = trip;
    } else {
      trips.unshift(trip);
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(trips));
    localStorage.setItem(ACTIVE_TRIP_KEY, trip.id);
  } catch (e) {
    console.error('Error saving trip to localStorage:', e);
  }
}

export function deleteSavedTrip(id: string): TripPlan[] {
  try {
    const trips = getSavedTrips().filter(t => t.id !== id);
    const finalTrips = trips.length > 0 ? trips : [DEFAULT_TRIP_TOKYO];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(finalTrips));
    return finalTrips;
  } catch {
    return [DEFAULT_TRIP_TOKYO];
  }
}

export function getActiveTripId(): string {
  try {
    return localStorage.getItem(ACTIVE_TRIP_KEY) || DEFAULT_TRIP_TOKYO.id;
  } catch {
    return DEFAULT_TRIP_TOKYO.id;
  }
}

export function setActiveTripId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_TRIP_KEY, id);
  } catch {}
}
