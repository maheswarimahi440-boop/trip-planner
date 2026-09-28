import React from 'react';
import { 
  LayoutDashboard, 
  CalendarRange, 
  MapPin, 
  Wallet, 
  Plane, 
  Building2, 
  Luggage, 
  FileCheck2, 
  UtensilsCrossed, 
  CloudSun 
} from 'lucide-react';

export type ActiveTab = 
  | 'overview' 
  | 'itinerary' 
  | 'map' 
  | 'budget' 
  | 'transport' 
  | 'hotel' 
  | 'packing' 
  | 'documents' 
  | 'food' 
  | 'weather';

interface CategoryNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  badgeCounts?: {
    packingRemaining?: number;
    documentsPending?: number;
    daysCount?: number;
  };
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeTab,
  onTabChange,
  badgeCounts
}) => {
  const tabs = [
    {
      id: 'overview' as ActiveTab,
      label: 'Overview',
      icon: LayoutDashboard,
      color: 'text-teal-600',
      activeBg: 'bg-teal-600 text-white',
      badge: null
    },
    {
      id: 'itinerary' as ActiveTab,
      label: 'Itinerary',
      icon: CalendarRange,
      color: 'text-indigo-600',
      activeBg: 'bg-indigo-600 text-white',
      badge: badgeCounts?.daysCount ? `${badgeCounts.daysCount}d` : null
    },
    {
      id: 'map' as ActiveTab,
      label: 'Map & Places',
      icon: MapPin,
      color: 'text-emerald-600',
      activeBg: 'bg-emerald-600 text-white',
      badge: null
    },
    {
      id: 'budget' as ActiveTab,
      label: 'Budget Tracker',
      icon: Wallet,
      color: 'text-amber-600',
      activeBg: 'bg-amber-600 text-white',
      badge: null
    },
    {
      id: 'transport' as ActiveTab,
      label: 'Transport',
      icon: Plane,
      color: 'text-sky-600',
      activeBg: 'bg-sky-600 text-white',
      badge: null
    },
    {
      id: 'hotel' as ActiveTab,
      label: 'Hotel & Stay',
      icon: Building2,
      color: 'text-violet-600',
      activeBg: 'bg-violet-600 text-white',
      badge: null
    },
    {
      id: 'packing' as ActiveTab,
      label: 'Packing List',
      icon: Luggage,
      color: 'text-rose-600',
      activeBg: 'bg-rose-600 text-white',
      badge: badgeCounts?.packingRemaining && badgeCounts.packingRemaining > 0 ? `${badgeCounts.packingRemaining}` : null
    },
    {
      id: 'documents' as ActiveTab,
      label: 'Documents',
      icon: FileCheck2,
      color: 'text-blue-600',
      activeBg: 'bg-blue-600 text-white',
      badge: badgeCounts?.documentsPending && badgeCounts.documentsPending > 0 ? `${badgeCounts.documentsPending}` : null
    },
    {
      id: 'food' as ActiveTab,
      label: 'Food Guide',
      icon: UtensilsCrossed,
      color: 'text-orange-600',
      activeBg: 'bg-orange-600 text-white',
      badge: null
    },
    {
      id: 'weather' as ActiveTab,
      label: 'Weather',
      icon: CloudSun,
      color: 'text-cyan-600',
      activeBg: 'bg-cyan-600 text-white',
      badge: null
    }
  ];

  return (
    <div className="w-full bg-white border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 custom-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer select-none ${
                  isActive
                    ? `${tab.activeBg} shadow-sm shadow-slate-900/10`
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <div className={`w-5 h-5 flex items-center justify-center shrink-0 ${isActive ? 'text-white' : tab.color}`}>
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <span>{tab.label}</span>

                {tab.badge && (
                  <span
                    className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600 border border-slate-200/60'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
