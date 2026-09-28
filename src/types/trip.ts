export type TravelStyle = 'Budget' | 'Standard' | 'Luxury';
export type TransportType = 'Flight' | 'Train' | 'Car' | 'Bus' | 'Ferry';
export type HotelPreference = 
  | 'Boutique Hotel' 
  | 'Luxury Resort' 
  | 'Central 4-Star' 
  | 'Cozy Airbnb' 
  | 'Budget Hostel' 
  | 'Eco-Lodge';

export type FoodPreference = 
  | 'Balanced & Local' 
  | 'Street Food & Markets' 
  | 'Fine Dining & Michelin' 
  | 'Vegetarian & Vegan' 
  | 'Halal' 
  | 'Gluten-Free';

export interface TripUserInput {
  destination: string;
  startingLocation: string;
  startDate?: string;
  endDate?: string;
  durationDays: number;
  travelers: number;
  adults: number;
  children: number;
  budget: number;
  currency: string;
  travelStyle: TravelStyle;
  preferredTransport: TransportType;
  hotelPreference: HotelPreference;
  foodPreference: FoodPreference;
  activities: string[];
  mustVisit: string;
  avoidPlaces: string;
  specialRequirements: string;
}

export interface CategoryBudget {
  estimated: number;
  planned: number;
  description: string;
}

export type BudgetCategoryKey = 
  | 'transportation'
  | 'hotels'
  | 'food'
  | 'localTransport'
  | 'activities'
  | 'shopping'
  | 'emergencyFund'
  | 'miscellaneous';

export interface ExpenseItem {
  id: string;
  category: BudgetCategoryKey;
  title: string;
  amount: number;
  date: string;
  notes?: string;
}

export interface BudgetBreakdown {
  total: number;
  currency: string;
  categories: Record<BudgetCategoryKey, CategoryBudget>;
  expenses: ExpenseItem[];
}

export interface TransportationOption {
  id: string;
  type: TransportType;
  title: string;
  provider: string;
  duration: string;
  estimatedCost: number;
  details: string;
  localTransfer: string;
  returnJourney: string;
  isPreferred: boolean;
  bookingRef?: string;
}

export interface HotelOption {
  id: string;
  name: string;
  type: string;
  rating: number;
  costPerNight: number;
  location: string;
  coordinates: { lat: number; lng: number };
  amenities: string[];
  description: string;
  isSelected: boolean;
  rooms?: number;
  guests?: number;
  bookingConfirmation?: string;
  imageUrl?: string;
}

export interface ActivityDetail {
  time: string;
  activity: string;
  location: string;
  coordinates: { lat: number; lng: number };
  cost: number;
  tips: string;
  completed?: boolean;
}

export interface MealRecommendation {
  name: string;
  specialty: string;
  estimatedCost: number;
  dietaryNote?: string;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  theme: string;
  area: string;
  estimatedDayCost: number;
  morning: ActivityDetail;
  breakfast: MealRecommendation;
  lunch: MealRecommendation;
  afternoon: ActivityDetail;
  evening: ActivityDetail;
  dinner: MealRecommendation;
  transitNotes: string;
  estimatedLocalTransitCost: number;
}

export interface AttractionCluster {
  clusterName: string;
  description: string;
  attractions: Array<{
    name: string;
    lat: number;
    lng: number;
    day: number;
    type?: string;
  }>;
}

export type PackingCategory = 
  | 'Clothes'
  | 'Toiletries'
  | 'Electronics'
  | 'Documents'
  | 'Medicines'
  | 'Travel accessories'
  | 'Special items';

export interface PackingItem {
  id: string;
  category: PackingCategory;
  item: string;
  checked: boolean;
  essential?: boolean;
}

export type DocumentStatus = 'needed' | 'in_progress' | 'ready' | 'recommended' | 'check';

export interface DocumentItem {
  id: string;
  title: string;
  status: DocumentStatus;
  requirement: string;
  notes?: string;
  fileReference?: string;
}

export interface FoodGuide {
  foodPreference: string;
  dailyFoodBudgetEstimate: number;
  signatureDishes: Array<{
    name: string;
    description: string;
    priceRange: string;
  }>;
  diningTips: string;
  recommendedSpots: Array<{
    name: string;
    type: string;
    neighborhood: string;
    price: string;
  }>;
}

export interface SafetyInfo {
  emergencyPhone: string;
  police: string;
  ambulance: string;
  nearestHospital: string;
  safetyTips: string[];
}

export interface WeatherDay {
  day: number;
  condition: string;
  highC: number;
  lowC: number;
  rainChance: number;
  summary?: string;
}

export interface WeatherForecast {
  summary: string;
  avgTempC: number;
  avgTempF: number;
  condition: string;
  packingAdvice: string;
  daily: WeatherDay[];
}

export interface TripPlan {
  id: string;
  createdAt: string;
  title: string;
  destination: string;
  startingLocation: string;
  country: string;
  summary: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  travelers: number;
  adults: number;
  children: number;
  budget: number;
  currency: string;
  travelStyle: TravelStyle;
  coordinates: { lat: number; lng: number };
  weatherForecast: WeatherForecast;
  budgetBreakdown: BudgetBreakdown;
  transportationOptions: TransportationOption[];
  hotelOptions: HotelOption[];
  itinerary: DayPlan[];
  attractionClusters: AttractionCluster[];
  packingList: PackingItem[];
  documents: DocumentItem[];
  foodGuide: FoodGuide;
  safetyAndEmergency: SafetyInfo;
  reminders: string[];
}
