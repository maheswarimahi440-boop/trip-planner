import React, { useState } from 'react';
import { 
  Compass, 
  Plus, 
  Share2, 
  Sparkles, 
  ChevronDown, 
  MapPin, 
  Calendar,
  Download,
  Trash2,
  Bot
} from 'lucide-react';
import { TripPlan } from '../types/trip';

interface HeaderProps {
  trips: TripPlan[];
  activeTrip: TripPlan;
  onSelectTrip: (tripId: string) => void;
  onNewTripClick: () => void;
  onOpenCopilot: () => void;
  onDeleteTrip: (tripId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  trips,
  activeTrip,
  onSelectTrip,
  onNewTripClick,
  onOpenCopilot,
  onDeleteTrip
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(activeTrip, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${activeTrip.destination.toLowerCase()}-trip-plan.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: activeTrip.title,
        text: `Check out my ${activeTrip.durationDays}-day trip plan to ${activeTrip.destination}!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-md shadow-teal-500/20 text-white font-bold">
            <Compass className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 font-sans">
                Trip<span className="text-teal-600">Planner</span>
              </span>
              <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200/60 rounded px-1.5 py-0.2 tracking-wide uppercase">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">Intelligent Itinerary & Travel Engine</p>
          </div>
        </div>

        {/* Center: Trip Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-800 text-sm font-medium transition-colors shadow-2xs"
            aria-label="Select active trip"
          >
            <MapPin className="w-4 h-4 text-teal-600 shrink-0" />
            <span className="max-w-[130px] sm:max-w-[200px] truncate font-semibold">
              {activeTrip.destination}
            </span>
            <span className="text-slate-400 text-xs hidden md:inline">
              · {activeTrip.durationDays}d
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Saved Trips
              </div>
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {trips.map((t) => (
                  <div
                    key={t.id}
                    className={`flex items-center justify-between px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer ${
                      t.id === activeTrip.id ? 'bg-teal-50/70 text-teal-900 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div 
                      className="flex-1 truncate mr-2"
                      onClick={() => {
                        onSelectTrip(t.id);
                        setDropdownOpen(false);
                      }}
                    >
                      <div className="truncate font-medium">{t.destination}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span>{t.durationDays} Days</span>
                        <span>·</span>
                        <span>{t.budget} {t.currency}</span>
                      </div>
                    </div>
                    {trips.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTrip(t.id);
                        }}
                        className="text-slate-300 hover:text-red-500 p-1 rounded transition-colors"
                        title="Delete trip"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-2 mt-1 px-2">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onNewTripClick();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Plan New Destination
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs sm:text-sm font-semibold border border-orange-200/80 transition-all shadow-2xs hover:shadow-sm"
          >
            <Bot className="w-4 h-4 text-orange-600" />
            <span className="hidden sm:inline">AI Copilot</span>
            <span className="text-[10px] font-bold bg-orange-200 text-orange-900 px-1 py-0.2 rounded">n8n</span>
          </button>

          <button
            onClick={handleExportJson}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
            title="Download Trip JSON"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors"
            title={shareCopied ? 'Link copied!' : 'Share Trip'}
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={onNewTripClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-teal-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden md:inline">Plan New Trip</span>
            <span className="md:hidden">New</span>
          </button>
        </div>

      </div>
    </header>
  );
};
