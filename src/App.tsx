/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TripPlan, TripUserInput } from './types/trip';
import { 
  getSavedTrips, 
  saveTrip, 
  deleteSavedTrip, 
  getActiveTripId, 
  setActiveTripId,
  generateTripWithAI 
} from './services/geminiService';
import { Header } from './components/Header';
import { CategoryNav, ActiveTab } from './components/CategoryNav';
import { DashboardOverview } from './components/DashboardOverview';
import { DailyItineraryView } from './components/DailyItineraryView';
import { TripMap } from './components/TripMap';
import { BudgetPlanner } from './components/BudgetPlanner';
import { TransportationPlanner } from './components/TransportationPlanner';
import { HotelPlanner } from './components/HotelPlanner';
import { PackingChecklist } from './components/PackingChecklist';
import { DocumentChecklist } from './components/DocumentChecklist';
import { FoodPlanner } from './components/FoodPlanner';
import { WeatherWidget } from './components/WeatherWidget';
import { TripFormModal } from './components/TripFormModal';
import { AICopilotDrawer } from './components/AICopilotDrawer';
import { N8nChatWidget } from './components/N8nChatWidget';
import { Sparkles, MapPin, Calendar, Heart } from 'lucide-react';

export default function App() {
  const [trips, setTrips] = useState<TripPlan[]>([]);
  const [activeTripId, setCurrentActiveId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isTripModalOpen, setIsTripModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isLoadingTrip, setIsLoadingTrip] = useState(false);

  // Initialize trips from localStorage
  useEffect(() => {
    const loadedTrips = getSavedTrips();
    setTrips(loadedTrips);
    const activeId = getActiveTripId();
    const found = loadedTrips.find(t => t.id === activeId);
    setCurrentActiveId(found ? found.id : loadedTrips[0]?.id || '');
  }, []);

  const activeTrip = trips.find(t => t.id === activeTripId) || trips[0];

  const handleSelectTrip = (id: string) => {
    setCurrentActiveId(id);
    setActiveTripId(id);
  };

  const handleUpdateTrip = (updatedTrip: TripPlan) => {
    saveTrip(updatedTrip);
    setTrips(prev => prev.map(t => t.id === updatedTrip.id ? updatedTrip : t));
  };

  const handleDeleteTrip = (id: string) => {
    const remaining = deleteSavedTrip(id);
    setTrips(remaining);
    if (activeTripId === id) {
      const nextId = remaining[0]?.id || '';
      setCurrentActiveId(nextId);
      setActiveTripId(nextId);
    }
  };

  const handleCreateNewTrip = async (input: TripUserInput) => {
    setIsLoadingTrip(true);
    try {
      const newPlan = await generateTripWithAI(input);
      saveTrip(newPlan);
      setTrips(prev => [newPlan, ...prev]);
      setCurrentActiveId(newPlan.id);
      setActiveTripId(newPlan.id);
      setIsTripModalOpen(false);
      setActiveTab('overview');
    } catch (err) {
      console.error('Trip generation error:', err);
    } finally {
      setIsLoadingTrip(false);
    }
  };

  if (!activeTrip) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-600">Initializing TripPlanner...</p>
        </div>
      </div>
    );
  }

  // Calculate badge counts
  const packingRemaining = (activeTrip.packingList || []).filter(p => !p.checked).length;
  const docsPending = (activeTrip.documents || []).filter(d => d.status !== 'ready').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        trips={trips}
        activeTrip={activeTrip}
        onSelectTrip={handleSelectTrip}
        onNewTripClick={() => setIsTripModalOpen(true)}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onDeleteTrip={handleDeleteTrip}
      />

      {/* Graphical Category Navigation Bar */}
      <CategoryNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        badgeCounts={{
          packingRemaining,
          documentsPending: docsPending,
          daysCount: activeTrip.durationDays
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <DashboardOverview
            trip={activeTrip}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'itinerary' && (
          <DailyItineraryView
            trip={activeTrip}
            onUpdateTrip={handleUpdateTrip}
          />
        )}

        {activeTab === 'map' && (
          <TripMap
            trip={activeTrip}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetPlanner
            trip={activeTrip}
            onUpdateTrip={handleUpdateTrip}
          />
        )}

        {activeTab === 'transport' && (
          <TransportationPlanner
            trip={activeTrip}
            onUpdateTrip={handleUpdateTrip}
          />
        )}

        {activeTab === 'hotel' && (
          <HotelPlanner
            trip={activeTrip}
            onUpdateTrip={handleUpdateTrip}
          />
        )}

        {activeTab === 'packing' && (
          <PackingChecklist
            trip={activeTrip}
            onUpdateTrip={handleUpdateTrip}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentChecklist
            trip={activeTrip}
            onUpdateTrip={handleUpdateTrip}
          />
        )}

        {activeTab === 'food' && (
          <FoodPlanner
            trip={activeTrip}
          />
        )}

        {activeTab === 'weather' && (
          <WeatherWidget
            trip={activeTrip}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <TripFormModal
        isOpen={isTripModalOpen}
        onClose={() => setIsTripModalOpen(false)}
        onSubmit={handleCreateNewTrip}
        isLoading={isLoadingTrip}
      />

      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        trip={activeTrip}
      />

      {/* Official n8n Chatbot Widget */}
      <N8nChatWidget />

      {/* Clean Minimalist Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">Trip<span className="text-teal-600">Planner</span></span>
            <span>·</span>
            <span>Intelligent Autonomous Travel Planning & Logistics</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsTripModalOpen(true)}
              className="hover:text-teal-600 font-semibold transition-colors"
            >
              Plan Destination
            </button>
            <button 
              onClick={() => setIsCopilotOpen(true)}
              className="hover:text-teal-600 font-semibold transition-colors"
            >
              Ask Copilot
            </button>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400">Powered by Gemini AI</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
