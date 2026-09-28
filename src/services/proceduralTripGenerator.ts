import {
  TripPlan,
  TripUserInput,
  DayPlan,
  AttractionCluster,
  PackingItem,
  DocumentItem,
  TransportationOption,
  HotelOption,
  BudgetBreakdown
} from '../types/trip';

// Known coordinates database for popular destinations
const CITY_COORDINATES: Record<string, { lat: number; lng: number; country: string; defaultWeather: string; avgC: number; emergency: { police: string; ambulance: string; hospital: string } }> = {
  tokyo: { lat: 35.6762, lng: 139.6503, country: 'Japan', defaultWeather: 'Pleasant & Mild', avgC: 20, emergency: { police: '110', ambulance: '119', hospital: 'St. Luke’s International Hospital' } },
  paris: { lat: 48.8566, lng: 2.3522, country: 'France', defaultWeather: 'Partly Sunny & Breezy', avgC: 18, emergency: { police: '17', ambulance: '15', hospital: 'Hôpital de l’Hôtel-Dieu Paris' } },
  rome: { lat: 41.9028, lng: 12.4964, country: 'Italy', defaultWeather: 'Warm & Sunny', avgC: 24, emergency: { police: '112', ambulance: '118', hospital: 'Policlinico Umberto I' } },
  london: { lat: 51.5074, lng: -0.1278, country: 'United Kingdom', defaultWeather: 'Mild with Occasional Showers', avgC: 17, emergency: { police: '999', ambulance: '999', hospital: 'St Thomas’ Hospital' } },
  'new york': { lat: 40.7128, lng: -74.0060, country: 'United States', defaultWeather: 'Brisk & Bright', avgC: 19, emergency: { police: '911', ambulance: '911', hospital: 'NYU Langone Health' } },
  bali: { lat: -8.4095, lng: 115.1889, country: 'Indonesia', defaultWeather: 'Tropical Warmth & Ocean Breeze', avgC: 28, emergency: { police: '110', ambulance: '118', hospital: 'BIMC Hospital Kuta' } },
  barcelona: { lat: 41.3851, lng: 2.1734, country: 'Spain', defaultWeather: 'Mediterranean Sunshine', avgC: 23, emergency: { police: '112', ambulance: '061', hospital: 'Hospital Clínic de Barcelona' } },
  kyoto: { lat: 35.0116, lng: 135.7681, country: 'Japan', defaultWeather: 'Clear & Serene', avgC: 19, emergency: { police: '110', ambulance: '119', hospital: 'Kyoto University Hospital' } },
  zurich: { lat: 47.3769, lng: 8.5417, country: 'Switzerland', defaultWeather: 'Crisp Alpine Air', avgC: 16, emergency: { police: '117', ambulance: '144', hospital: 'University Hospital Zurich' } },
  amsterdam: { lat: 52.3676, lng: 4.9041, country: 'Netherlands', defaultWeather: 'Gentle Maritime Breeze', avgC: 17, emergency: { police: '112', ambulance: '112', hospital: 'Amsterdam UMC' } },
  dubai: { lat: 25.2048, lng: 55.2708, country: 'United Arab Emirates', defaultWeather: 'Sunny & Warm', avgC: 31, emergency: { police: '999', ambulance: '998', hospital: 'Rashid Hospital Dubai' } },
  singapore: { lat: 1.3521, lng: 103.8198, country: 'Singapore', defaultWeather: 'Tropical Sunshine', avgC: 29, emergency: { police: '999', ambulance: '995', hospital: 'Singapore General Hospital' } },
  sydney: { lat: -33.8688, lng: 151.2093, country: 'Australia', defaultWeather: 'Sunny Coastal Temperate', avgC: 22, emergency: { police: '000', ambulance: '000', hospital: 'St Vincent’s Hospital Sydney' } }
};

export function generateProceduralTrip(input: TripUserInput): TripPlan {
  const destLower = input.destination.toLowerCase().trim();
  const matchedKey = Object.keys(CITY_COORDINATES).find(k => destLower.includes(k)) || 'paris';
  const meta = CITY_COORDINATES[matchedKey] || {
    lat: 48.8566,
    lng: 2.3522,
    country: 'International',
    defaultWeather: 'Mild & Sunny',
    avgC: 21,
    emergency: { police: '112', ambulance: '112', hospital: 'City Central Hospital' }
  };

  const days = Math.max(1, Math.min(input.durationDays || 5, 14));
  const budget = input.budget || 2500;
  const currency = input.currency || 'USD';
  const travelers = input.travelers || 2;
  const nights = Math.max(1, days - 1);

  // Budget category allocation percentages based on travel style
  let transPct = 0.30;
  let hotelPct = 0.32;
  let foodPct = 0.16;
  let localPct = 0.05;
  let actPct = 0.08;
  let shopPct = 0.04;
  let emerPct = 0.03;
  let miscPct = 0.02;

  if (input.travelStyle === 'Luxury') {
    hotelPct = 0.38;
    foodPct = 0.20;
    transPct = 0.25;
  } else if (input.travelStyle === 'Budget') {
    hotelPct = 0.25;
    transPct = 0.35;
    foodPct = 0.15;
    shopPct = 0.03;
  }

  const budgetBreakdown: BudgetBreakdown = {
    total: budget,
    currency,
    categories: {
      transportation: {
        estimated: Math.round(budget * transPct),
        planned: Math.round(budget * transPct * 0.96),
        description: `Long-distance travel from ${input.startingLocation} to ${input.destination}`
      },
      hotels: {
        estimated: Math.round(budget * hotelPct),
        planned: Math.round(budget * hotelPct * 0.98),
        description: `${input.hotelPreference} accommodations for ${nights} nights (${travelers} travelers)`
      },
      food: {
        estimated: Math.round(budget * foodPct),
        planned: Math.round(budget * foodPct),
        description: `${input.foodPreference} dining, cafes, and local tastings`
      },
      localTransport: {
        estimated: Math.round(budget * localPct),
        planned: Math.round(budget * localPct * 0.95),
        description: 'Subway passes, regional trains, and taxi transfers'
      },
      activities: {
        estimated: Math.round(budget * actPct),
        planned: Math.round(budget * actPct),
        description: 'Museum passes, guided tours, and landmark access'
      },
      shopping: {
        estimated: Math.round(budget * shopPct),
        planned: Math.round(budget * shopPct),
        description: 'Artisanal crafts, regional gifts, and memories'
      },
      emergencyFund: {
        estimated: Math.round(budget * emerPct),
        planned: Math.round(budget * emerPct),
        description: 'Contingency fund for itinerary adjustments or delays'
      },
      miscellaneous: {
        estimated: Math.round(budget * miscPct),
        planned: Math.round(budget * miscPct),
        description: 'Data eSIM, tipping, baggage lockers, and fees'
      }
    },
    expenses: [
      {
        id: `exp-${Date.now()}-1`,
        category: 'transportation',
        title: `Outbound & Return ${input.preferredTransport}`,
        amount: Math.round(budget * transPct * 0.9),
        date: input.startDate || new Date().toISOString().slice(0, 10),
        notes: `Confirmed via ${input.preferredTransport}`
      },
      {
        id: `exp-${Date.now()}-2`,
        category: 'hotels',
        title: `${input.hotelPreference} Booking Deposit`,
        amount: Math.round(budget * hotelPct * 0.5),
        date: input.startDate || new Date().toISOString().slice(0, 10),
        notes: 'Initial 50% reservation guarantee'
      }
    ]
  };

  // Hotel cost per night calculation
  const totalHotelBudget = budgetBreakdown.categories.hotels.estimated;
  const costPerNight = Math.max(45, Math.round(totalHotelBudget / nights));

  const hotelOptions: HotelOption[] = [
    {
      id: 'hotel-opt-1',
      name: `${input.destination} Grand Boutique Hotel & Spa`,
      type: input.hotelPreference,
      rating: 4.85,
      costPerNight,
      location: `Central Historic District, ${input.destination}`,
      coordinates: { lat: meta.lat + 0.008, lng: meta.lng + 0.007 },
      amenities: ['High-speed Wi-Fi', 'Complimentary Breakfast', 'Concierge Service', 'Air Conditioning', 'Luggage Storage'],
      description: `Elegantly designed hotel with convenient access to central metro lines and vibrant dining precincts.`,
      isSelected: true,
      rooms: 1,
      guests: travelers,
      bookingConfirmation: `RES-${input.destination.slice(0, 3).toUpperCase()}-7742`
    },
    {
      id: 'hotel-opt-2',
      name: `${input.destination} Heritage Riverside Suites`,
      type: 'Boutique Hotel',
      rating: 4.75,
      costPerNight: Math.round(costPerNight * 1.15),
      location: `Scenic Waterfront Quarter, ${input.destination}`,
      coordinates: { lat: meta.lat - 0.009, lng: meta.lng + 0.004 },
      amenities: ['Rooftop Terrace', 'Boutique Bar', 'Fitness Studio', 'Airport Transfer'],
      description: `Charming boutique retreat offering panoramic river panoramas and quiet evening ambiance.`,
      isSelected: false,
      rooms: 1,
      guests: travelers
    }
  ];

  // Transportation options
  const transportOptions: TransportationOption[] = [
    {
      id: 'trans-opt-1',
      type: input.preferredTransport,
      title: `Express ${input.preferredTransport}: ${input.startingLocation} ➔ ${input.destination}`,
      provider: input.preferredTransport === 'Flight' ? 'National Airlines' : input.preferredTransport === 'Train' ? 'High-Speed Rail Express' : 'Premium Coach Line',
      duration: input.preferredTransport === 'Flight' ? '4h 15m' : '6h 30m',
      estimatedCost: budgetBreakdown.categories.transportation.estimated,
      details: `Convenient departure schedule with flexible luggage allowance and priority boarding.`,
      localTransfer: `Airport/Central Station express train direct to city center (approx. 20-30 mins).`,
      returnJourney: `Return journey scheduled for final day afternoon departure.`,
      isPreferred: true,
      bookingRef: `TKT-${Math.floor(100000 + Math.random() * 900000)}`
    }
  ];

  // Daily Itinerary generation
  const itinerary: DayPlan[] = [];
  const attractionClusters: AttractionCluster[] = [];

  const defaultThemeDays = [
    { title: 'Historic Heart & Orientation', theme: 'Foundations & Architecture', area: 'Old Town & Main Plaza' },
    { title: 'Art Treasures & Iconic Landmarks', theme: 'Masterpieces & Scenic Views', area: 'Cultural District & Museums' },
    { title: 'Local Markets & Hidden Alleys', theme: 'Flavors & Neighborhood Living', area: 'Artisan & Culinary Quarter' },
    { title: 'Nature Parks & Panoramic Heights', theme: 'Open Spaces & Sunset Vistas', area: 'Gardens & Elevated Overlook' },
    { title: 'Living Culture & Evening Magic', theme: 'Boutiques, Cafes & Twilight Lights', area: 'Trendy Waterfront & Night Bazaar' },
    { title: 'Traditions, Crafts & Farewell Stroll', theme: 'Souvenirs & Last Memories', area: 'Historic Promenade' }
  ];

  for (let i = 1; i <= days; i++) {
    const themeIdx = (i - 1) % defaultThemeDays.length;
    const themeInfo = defaultThemeDays[themeIdx];
    const offsetLat = (Math.sin(i * 1.5) * 0.015);
    const offsetLng = (Math.cos(i * 1.5) * 0.015);

    const morningCoord = { lat: meta.lat + offsetLat, lng: meta.lng + offsetLng };
    const afternoonCoord = { lat: meta.lat + offsetLat + 0.005, lng: meta.lng + offsetLng - 0.006 };
    const eveningCoord = { lat: meta.lat + offsetLat - 0.004, lng: meta.lng + offsetLng + 0.008 };

    const dayPlan: DayPlan = {
      dayNumber: i,
      title: i === 1 ? `Day 1: Arrival & ${themeInfo.title}` : i === days ? `Day ${i}: Farewell Highlights & Departure` : `Day ${i}: ${themeInfo.title}`,
      theme: themeInfo.theme,
      area: themeInfo.area,
      estimatedDayCost: Math.round((budgetBreakdown.categories.activities.estimated + budgetBreakdown.categories.food.estimated) / days),
      morning: {
        time: '09:00 AM',
        activity: i === 1 ? `Arrive, check into hotel, and take scenic walking tour of ${input.destination} center` : `Visit the celebrated historical center and architectural monuments of ${input.destination}`,
        location: `${input.destination} Historic Core`,
        coordinates: morningCoord,
        cost: i === 1 ? 0 : 18,
        tips: 'Book morning priority tickets to skip peak waiting lines.',
        completed: false
      },
      breakfast: {
        name: `${input.destination} Artisan Morning Cafe`,
        specialty: 'Freshly baked pastries, specialty roasted coffee & seasonal fruit tart',
        estimatedCost: 12
      },
      lunch: {
        name: `La Bottega & Trattoria ${input.destination}`,
        specialty: `Authentic regional ${input.foodPreference} specialty platter with seasonal ingredients`,
        estimatedCost: 24
      },
      afternoon: {
        time: '02:00 PM',
        activity: `Explore famous cultural galleries, scenic riverwalk, and landmark squares of ${input.destination}`,
        location: `${input.destination} Grand Promenade & Heritage Site`,
        coordinates: afternoonCoord,
        cost: 22,
        tips: 'Ideal lighting for photography during golden hour.',
        completed: false
      },
      evening: {
        time: '06:30 PM',
        activity: `Sunset viewpoint overlook followed by illuminated evening walk through bustling pedestrian lanes`,
        location: `${input.destination} Twilight Viewpoint`,
        coordinates: eveningCoord,
        cost: 0,
        tips: 'Arrive 20 minutes before sunset for the best observation spots.',
        completed: false
      },
      dinner: {
        name: `Bistrot Etoile ${input.destination}`,
        specialty: 'Chef’s signature dinner tasting menu paired with local beverage pairings',
        estimatedCost: 38
      },
      transitNotes: `Short 10-15 minute walk or 2-stop metro transit between morning and evening spots. Keep day transit pass ready.`,
      estimatedLocalTransitCost: 8
    };

    itinerary.push(dayPlan);

    // Group into attraction cluster
    if (i <= 4) {
      attractionClusters.push({
        clusterName: `Cluster ${i}: ${themeInfo.area}`,
        description: `Nearby sights grouped together to minimize travel between visits.`,
        attractions: [
          { name: `${input.destination} Morning Monument`, lat: morningCoord.lat, lng: morningCoord.lng, day: i, type: 'Historical' },
          { name: `${input.destination} Cultural Site`, lat: afternoonCoord.lat, lng: afternoonCoord.lng, day: i, type: 'Cultural' },
          { name: `${input.destination} Scenic Overlook`, lat: eveningCoord.lat, lng: eveningCoord.lng, day: i, type: 'Viewpoint' }
        ]
      });
    }
  }

  // Packing list
  const packingList: PackingItem[] = [
    { id: 'p-1', category: 'Clothes', item: `${days} comfortable daytime shirts & tops`, checked: false, essential: true },
    { id: 'p-2', category: 'Clothes', item: '2 pairs lightweight travel trousers or denim', checked: false, essential: true },
    { id: 'p-3', category: 'Clothes', item: 'Comfortable broken-in walking sneakers', checked: false, essential: true },
    { id: 'p-4', category: 'Clothes', item: '1 smart evening outfit for fine dining', checked: false },
    { id: 'p-5', category: 'Clothes', item: 'Weather-resistant lightweight outer jacket', checked: false, essential: true },
    { id: 'p-6', category: 'Toiletries', item: 'Travel size sunscreen SPF 30+ & face moisturizer', checked: false, essential: true },
    { id: 'p-7', category: 'Toiletries', item: 'Toothbrush, dental floss & biodegradable toothpaste', checked: false },
    { id: 'p-8', category: 'Toiletries', item: 'Pocket hand sanitizer and facial wipes', checked: false },
    { id: 'p-9', category: 'Electronics', item: 'Universal multi-country plug adapter', checked: false, essential: true },
    { id: 'p-10', category: 'Electronics', item: '10,000mAh high-speed portable battery bank', checked: false, essential: true },
    { id: 'p-11', category: 'Electronics', item: 'Phone charging cables and noise-cancelling headphones', checked: false },
    { id: 'p-12', category: 'Documents', item: 'Passport / National ID valid for 6+ months', checked: false, essential: true },
    { id: 'p-13', category: 'Documents', item: 'Boarding passes and digital hotel vouchers saved offline', checked: false, essential: true },
    { id: 'p-14', category: 'Documents', item: 'Travel & health insurance policy certificate', checked: false, essential: true },
    { id: 'p-15', category: 'Medicines', item: 'Personal prescription medications in original containers', checked: false, essential: true },
    { id: 'p-16', category: 'Medicines', item: 'Blister bandages and pain reliever (paracetamol/ibuprofen)', checked: false },
    { id: 'p-17', category: 'Medicines', item: 'Electrolyte rehydration tablets & motion sickness pills', checked: false },
    { id: 'p-18', category: 'Travel accessories', item: 'Compact windproof travel umbrella', checked: false },
    { id: 'p-19', category: 'Travel accessories', item: 'Lightweight foldable tote bag for souvenirs & shopping', checked: false },
    { id: 'p-20', category: 'Special items', item: 'Daypack backpack with anti-theft zipper clips', checked: false }
  ];

  // Documents
  const documents: DocumentItem[] = [
    { id: 'doc-1', title: 'Passport / Government Photo ID', status: 'ready', requirement: 'Must have at least 6 months validity from planned return date.', notes: '' },
    { id: 'doc-2', title: `Inbound & Return ${input.preferredTransport} Tickets`, status: 'ready', requirement: 'Confirmed e-tickets with QR codes accessible offline.', notes: '' },
    { id: 'doc-3', title: 'Hotel / Lodging Booking Confirmation', status: 'ready', requirement: 'Voucher showing hotel contact number and address for customs.', notes: '' },
    { id: 'doc-4', title: 'Comprehensive Travel & Medical Insurance', status: 'recommended', requirement: 'Covers emergency evacuation, hospital expenses & flight disruptions.', notes: '' },
    { id: 'doc-5', title: 'Visa / ETA Travel Authorization', status: 'check', requirement: 'Check entry requirements for your passport nationality before departure.', notes: '' },
    { id: 'doc-6', title: 'Emergency Contacts & Local Embassy Details', status: 'ready', requirement: 'Stored locally in phone contacts for immediate offline access.', notes: '' }
  ];

  // Food guide
  const foodGuide = {
    foodPreference: input.foodPreference,
    dailyFoodBudgetEstimate: Math.round(budgetBreakdown.categories.food.estimated / days),
    signatureDishes: [
      { name: `${input.destination} Traditional Stew & Broth`, description: 'Slow-cooked local staple served with freshly baked bread', priceRange: '$$' },
      { name: 'Artisan Pastry & Local Cheese Plate', description: 'Celebrated regional cheese and seasonal honeycomb', priceRange: '$' },
      { name: 'Catch of the Day / Regional Roast', description: 'Freshly sourced produce seasoned with indigenous garden herbs', priceRange: '$$$' }
    ],
    diningTips: 'Ask for the daily lunch menu (plat du jour / menu del día) for the highest quality at favorable pricing. Round up restaurant bills by 5-10% for attentive table service.',
    recommendedSpots: [
      { name: `Cafe de ${input.destination}`, type: 'Historic Coffeehouse', neighborhood: 'Central Square', price: '$$' },
      { name: 'Mercado Central Food Stalls', type: 'Street Market Gourmet', neighborhood: 'Old Harbor', price: '$' },
      { name: `La Terrasse Panorama`, type: 'Fine Dining Sunset', neighborhood: 'Upper Hill', price: '$$$' }
    ]
  };

  // Weather forecast
  const weatherDaily = [];
  for (let d = 1; d <= days; d++) {
    weatherDaily.push({
      day: d,
      condition: d % 3 === 0 ? 'Scattered Clouds' : 'Sunny & Clear',
      highC: meta.avgC + (d % 2 === 0 ? 1 : -1),
      lowC: meta.avgC - 7,
      rainChance: d % 4 === 0 ? 25 : 5,
      summary: d % 3 === 0 ? 'Mild breeze and light cloud cover' : 'Crisp sunshine ideal for walking'
    });
  }

  return {
    id: `trip-${Date.now()}`,
    createdAt: new Date().toISOString(),
    title: `${days}-Day Curated Journey in ${input.destination}`,
    destination: input.destination,
    startingLocation: input.startingLocation,
    country: meta.country,
    summary: `A carefully paced ${days}-day expedition to ${input.destination}, crafted for ${travelers} traveler${travelers > 1 ? 's' : ''} with a focus on ${input.activities.length ? input.activities.join(', ') : 'culture, fine food, and scenic highlights'}.`,
    startDate: input.startDate || new Date().toISOString().slice(0, 10),
    endDate: input.endDate || new Date(Date.now() + days * 86400000).toISOString().slice(0, 10),
    durationDays: days,
    travelers,
    adults: input.adults || travelers,
    children: input.children || 0,
    budget,
    currency,
    travelStyle: input.travelStyle,
    coordinates: { lat: meta.lat, lng: meta.lng },
    weatherForecast: {
      summary: `${meta.defaultWeather} with daytime highs around ${meta.avgC}°C (${Math.round(meta.avgC * 1.8 + 32)}°F).`,
      avgTempC: meta.avgC,
      avgTempF: Math.round(meta.avgC * 1.8 + 32),
      condition: meta.defaultWeather,
      packingAdvice: 'Pack comfortable walking footwear and light breathable layers with an evening jacket.',
      daily: weatherDaily
    },
    budgetBreakdown,
    transportationOptions: transportOptions,
    hotelOptions,
    itinerary,
    attractionClusters,
    packingList,
    documents,
    foodGuide,
    safetyAndEmergency: {
      emergencyPhone: `${meta.emergency.police} (Police) / ${meta.emergency.ambulance} (Medical)`,
      police: meta.emergency.police,
      ambulance: meta.emergency.ambulance,
      nearestHospital: meta.emergency.hospital,
      safetyTips: [
        'Keep duplicate photocopies of passport and tickets in your hotel safe.',
        'Use authorized rideshare or metered taxi stands rather than unmetered street rides.',
        'Carry a digital offline copy of maps and emergency contacts.'
      ]
    },
    reminders: [
      `Confirm ${input.destination} transit passes upon arrival to save on daily travel.`,
      `Notify your bank of travel to prevent transaction card blocks.`,
      `Book high-demand museum and monument tickets 1-2 weeks in advance.`
    ]
  };
}
