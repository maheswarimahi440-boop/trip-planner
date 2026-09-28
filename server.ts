import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Gemini API client
  const apiKey = process.env.GEMINI_API_KEY || '';
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({ apiKey });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI with key:', e);
    }
  }

  // API Health
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasGeminiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    });
  });

  // API: Generate Trip Plan
  app.post('/api/generate-trip', async (req, res) => {
    try {
      const tripParams = req.body;
      const {
        destination,
        startingLocation,
        durationDays = 5,
        travelers = 2,
        adults = 2,
        children = 0,
        budget = 2500,
        currency = 'USD',
        travelStyle = 'Standard',
        preferredTransport = 'Flight',
        hotelPreference = 'Boutique Hotel',
        foodPreference = 'Balanced & Local',
        activities = [],
        mustVisit = '',
        avoidPlaces = '',
        specialRequirements = '',
      } = tripParams;

      // If Gemini API is available, generate dynamic realistic plan
      if (ai && apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const prompt = `You are a world-class luxury & smart travel planner. Generate a complete, realistic, richly detailed trip plan in valid JSON format.
Trip Request:
- Destination: ${destination}
- Starting Location: ${startingLocation}
- Duration: ${durationDays} days
- Travelers: ${travelers} (${adults} adults, ${children} children)
- Total Budget: ${budget} ${currency}
- Travel Style: ${travelStyle}
- Preferred Transport: ${preferredTransport}
- Hotel Preference: ${hotelPreference}
- Food Preference: ${foodPreference}
- Activities & Interests: ${Array.isArray(activities) ? activities.join(', ') : activities}
- Must-Visit Places: ${mustVisit || 'Top highlights'}
- Places to Avoid: ${avoidPlaces || 'None'}
- Special Requirements: ${specialRequirements || 'None'}

Return ONLY valid JSON matching this exact structure without markdown backticks:
{
  "title": "Inspiring trip title",
  "destination": "${destination}",
  "startingLocation": "${startingLocation}",
  "country": "Country name",
  "summary": "2-3 sentence overview of this curated trip experience",
  "coordinates": { "lat": 35.6762, "lng": 139.6503 },
  "weatherForecast": {
    "summary": "Expected weather summary during trip",
    "avgTempC": 22,
    "avgTempF": 72,
    "condition": "Sunny / Mild / Rain",
    "packingAdvice": "Crucial weather packing recommendation",
    "daily": [
      { "day": 1, "condition": "Partly Cloudy", "highC": 23, "lowC": 15, "rainChance": 10 }
    ]
  },
  "budgetBreakdown": {
    "total": ${budget},
    "currency": "${currency}",
    "categories": {
      "transportation": { "estimated": 600, "description": "Long-distance and intercity travel" },
      "hotels": { "estimated": 900, "description": "Accommodations" },
      "food": { "estimated": 450, "description": "Meals, snacks, and drinks" },
      "localTransport": { "estimated": 120, "description": "Metro, cabs, and transit passes" },
      "activities": { "estimated": 250, "description": "Museums, tours, entry tickets" },
      "shopping": { "estimated": 100, "description": "Souvenirs and shopping" },
      "emergencyFund": { "estimated": 50, "description": "Contingency reserve" },
      "miscellaneous": { "estimated": 30, "description": "SIM card, tips, lockers" }
    }
  },
  "transportationOptions": [
    {
      "id": "trans-1",
      "type": "${preferredTransport}",
      "title": "Primary Route from ${startingLocation} to ${destination}",
      "provider": "Sample Airline or Rail",
      "duration": "Duration e.g. 5h 30m",
      "estimatedCost": 450,
      "details": "Details including baggage and terminal",
      "localTransfer": "Recommended airport/station train into downtown",
      "returnJourney": "Return travel details",
      "isPreferred": true
    }
  ],
  "hotelOptions": [
    {
      "id": "hotel-1",
      "name": "Recommended Hotel Name",
      "type": "${hotelPreference}",
      "rating": 4.8,
      "costPerNight": 180,
      "location": "Central neighborhood in ${destination}",
      "coordinates": { "lat": 35.6895, "lng": 139.6917 },
      "amenities": ["Free High-speed WiFi", "Breakfast Included", "Air Conditioning", "Prime Location"],
      "description": "Why this hotel fits their style and budget",
      "isSelected": true
    }
  ],
  "itinerary": [
    {
      "dayNumber": 1,
      "title": "Arrival & Historic Orientation",
      "theme": "Settling in & First Impressions",
      "area": "Downtown / Historic Quarter",
      "estimatedDayCost": 80,
      "morning": {
        "time": "09:00 AM",
        "activity": "Morning visit to iconic landmark",
        "location": "Landmark Name",
        "coordinates": { "lat": 35.68, "lng": 139.7 },
        "cost": 15,
        "tips": "Book morning tickets ahead to avoid lines"
      },
      "breakfast": {
        "name": "Local Cafe / Bakery Name",
        "specialty": "Signature breakfast item",
        "estimatedCost": 12
      },
      "lunch": {
        "name": "Charming Bistro / Market",
        "specialty": "Traditional regional dish",
        "estimatedCost": 22
      },
      "afternoon": {
        "time": "02:00 PM",
        "activity": "Scenic afternoon walking tour or museum",
        "location": "Attraction Name",
        "coordinates": { "lat": 35.69, "lng": 139.71 },
        "cost": 25,
        "tips": "Great photo opportunity"
      },
      "evening": {
        "time": "06:30 PM",
        "activity": "Sunset viewpoint or promenade walk",
        "location": "Viewpoint Name",
        "coordinates": { "lat": 35.70, "lng": 139.72 },
        "cost": 0,
        "tips": "Arrive 30 mins before sunset"
      },
      "dinner": {
        "name": "Atmospheric Dinner Venue",
        "specialty": "Must-try authentic dinner dish",
        "estimatedCost": 35
      },
      "transitNotes": "Short 10-15 minute subway/walk between spots. Keep daily metro pass handy.",
      "estimatedLocalTransitCost": 10
    }
  ],
  "attractionClusters": [
    {
      "clusterName": "Cluster 1: Historic Core",
      "description": "Grouped together to save transit time",
      "attractions": [
        { "name": "Historic Landmark", "lat": 35.68, "lng": 139.7, "day": 1 }
      ]
    }
  ],
  "packingList": [
    { "id": "p-1", "category": "Clothes", "item": "Light breathable layers", "checked": false },
    { "id": "p-2", "category": "Electronics", "item": "Universal travel adapter plug", "checked": false },
    { "id": "p-3", "category": "Toiletries", "item": "Travel size sunblock & moisturizer", "checked": false },
    { "id": "p-4", "category": "Documents", "item": "Passport valid for 6+ months", "checked": false },
    { "id": "p-5", "category": "Medicines", "item": "Motion sickness & pain reliever", "checked": false },
    { "id": "p-6", "category": "Travel accessories", "item": "Comfortable walking sneakers", "checked": false },
    { "id": "p-7", "category": "Special items", "item": "Compact umbrella / rain jacket", "checked": false }
  ],
  "documents": [
    { "id": "doc-1", "title": "Valid Passport / Government ID", "status": "needed", "requirement": "Must have 6 months validity prior to travel", "notes": "" },
    { "id": "doc-2", "title": "Inbound & Outbound Transport Tickets", "status": "needed", "requirement": "Digital or printed boarding pass", "notes": "" },
    { "id": "doc-3", "title": "Hotel / Lodging Booking Voucher", "status": "needed", "requirement": "Required for immigration entry form", "notes": "" },
    { "id": "doc-4", "title": "Travel & Medical Insurance", "status": "recommended", "requirement": "Coverage for health emergencies & trip cancellation", "notes": "" },
    { "id": "doc-5", "title": "Visa or Electronic Travel Authorization (ETA)", "status": "check", "requirement": "Verify entry visa status for nationality", "notes": "" },
    { "id": "doc-6", "title": "Local Emergency Contacts & Embassy Details", "status": "ready", "requirement": "Local emergency numbers saved on phone", "notes": "" }
  ],
  "foodGuide": {
    "foodPreference": "${foodPreference}",
    "dailyFoodBudgetEstimate": 45,
    "signatureDishes": [
      { "name": "Iconic Regional Dish", "description": "Authentic local specialty", "priceRange": "$$" }
    ],
    "diningTips": "Tipping customs, etiquette, and booking guidelines",
    "recommendedSpots": [
      { "name": "Spot Name", "type": "Casual / Street Food / Fine Dining", "neighborhood": "Downtown", "price": "$$" }
    ]
  },
  "safetyAndEmergency": {
    "emergencyPhone": "112 or local equivalent",
    "police": "Local police number",
    "ambulance": "Ambulance number",
    "nearestHospital": "Central International Hospital",
    "safetyTips": [
      "Keep digital backup copies of passport in secure cloud",
      "Avoid unofficial taxi operators; use metered cabs or transit apps"
    ]
  }
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '';
        const parsed = JSON.parse(text);
        return res.json({ success: true, plan: parsed });
      }

      // If no API key or failed, client will use intelligent built-in generator
      return res.json({ success: false, message: 'Gemini API not configured. Use client-side smart generator.' });
    } catch (err: any) {
      console.error('Gemini Trip Generation Error:', err);
      res.status(500).json({ success: false, error: err.message || 'Generation failed' });
    }
  });

  // API: AI Travel Copilot Chat
  app.post('/api/chat-assistant', async (req, res) => {
    try {
      const { message, tripContext } = req.body;
      if (ai && apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const systemInstruction = `You are "TripPlanner AI", a warm, knowledgeable, concise, and ultra-practical travel assistant.
Current Trip Details:
- Destination: ${tripContext?.destination || 'User trip'}
- Duration: ${tripContext?.durationDays || '5'} days
- Travelers: ${tripContext?.travelers || '2'}
- Budget: ${tripContext?.budget || '2500'} ${tripContext?.currency || 'USD'}
- Style: ${tripContext?.travelStyle || 'Standard'}

Provide immediate, useful, well-structured travel advice. Keep responses concise (under 250 words), actionable, and friendly with emojis. Include estimated costs and local tips where helpful.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: message,
          config: {
            systemInstruction,
          },
        });

        return res.json({ reply: response.text });
      }

      return res.json({
        reply: `Here is a tip for your trip to ${tripContext?.destination || 'your destination'}: Remember to check local transport passes, carry a universal power adapter, and keep digital copies of your passport. How else can I help tailor your itinerary?`
      });
    } catch (err: any) {
      console.error('Chat error:', err);
      res.status(500).json({ reply: 'Sorry, I had trouble processing that request. Please try again!' });
    }
  });

  // Setup Vite or static serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TripPlanner server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
