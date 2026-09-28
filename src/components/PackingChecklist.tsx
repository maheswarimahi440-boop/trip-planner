import React, { useState } from 'react';
import { 
  Luggage, 
  Check, 
  Plus, 
  Trash2, 
  Shirt, 
  Sparkles, 
  Smartphone, 
  FileText, 
  Pill, 
  Compass, 
  Star,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { TripPlan, PackingItem, PackingCategory } from '../types/trip';

interface PackingChecklistProps {
  trip: TripPlan;
  onUpdateTrip: (updatedTrip: TripPlan) => void;
}

const CATEGORY_META: Record<PackingCategory, { label: string; icon: any; color: string; bg: string }> = {
  Clothes: { label: 'Clothes', icon: Shirt, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  Toiletries: { label: 'Toiletries', icon: Sparkles, color: 'text-rose-600', bg: 'bg-rose-50' },
  Electronics: { label: 'Electronics', icon: Smartphone, color: 'text-sky-600', bg: 'bg-sky-50' },
  Documents: { label: 'Documents', icon: FileText, color: 'text-amber-600', bg: 'bg-amber-50' },
  Medicines: { label: 'Medicines', icon: Pill, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'Travel accessories': { label: 'Travel Accessories', icon: Compass, color: 'text-teal-600', bg: 'bg-teal-50' },
  'Special items': { label: 'Special Items', icon: Star, color: 'text-purple-600', bg: 'bg-purple-50' }
};

export const PackingChecklist: React.FC<PackingChecklistProps> = ({
  trip,
  onUpdateTrip
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PackingCategory | 'All'>('All');
  const [filterMode, setFilterMode] = useState<'all' | 'remaining' | 'packed'>('all');
  const [newItemText, setNewItemText] = useState('');
  const [newItemCat, setNewItemCat] = useState<PackingCategory>('Clothes');
  const [isEssential, setIsEssential] = useState(false);

  const packingList = trip.packingList || [];
  const packedCount = packingList.filter(p => p.checked).length;
  const totalCount = packingList.length;
  const progressPct = totalCount > 0 ? Math.round((packedCount / totalCount) * 100) : 0;

  const handleToggleItem = (itemId: string) => {
    const updated = packingList.map(item => 
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    onUpdateTrip({ ...trip, packingList: updated });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const newItem: PackingItem = {
      id: `p-${Date.now()}`,
      category: newItemCat,
      item: newItemText.trim(),
      checked: false,
      essential: isEssential
    };

    onUpdateTrip({
      ...trip,
      packingList: [...packingList, newItem]
    });

    setNewItemText('');
    setIsEssential(false);
  };

  const handleDeleteItem = (itemId: string) => {
    const updated = packingList.filter(item => item.id !== itemId);
    onUpdateTrip({ ...trip, packingList: updated });
  };

  const handleCheckAll = () => {
    const updated = packingList.map(p => ({ ...p, checked: true }));
    onUpdateTrip({ ...trip, packingList: updated });
  };

  const handleUncheckAll = () => {
    const updated = packingList.map(p => ({ ...p, checked: false }));
    onUpdateTrip({ ...trip, packingList: updated });
  };

  // Filter items
  const filteredItems = packingList.filter(item => {
    if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
    if (filterMode === 'remaining' && item.checked) return false;
    if (filterMode === 'packed' && !item.checked) return false;
    return true;
  });

  const categories: PackingCategory[] = [
    'Clothes',
    'Toiletries',
    'Electronics',
    'Documents',
    'Medicines',
    'Travel accessories',
    'Special items'
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-rose-900/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-300 bg-rose-950/70 border border-rose-700/60 px-2.5 py-1 rounded-full">
            Smart Luggage Assistant
          </span>
          <h2 className="text-xl sm:text-2xl font-black">
            Personalized Packing Checklist
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Auto-tailored for {trip.durationDays} days in {trip.destination} based on expected weather ({trip.weatherForecast?.avgTempC}°C) and planned activities.
          </p>
          <div className="text-xs text-rose-200 bg-white/10 px-3 py-1.5 rounded-xl inline-block mt-1">
            🌤️ Weather Advice: {trip.weatherForecast?.packingAdvice || 'Layered clothing & comfortable walking sneakers'}
          </div>
        </div>

        {/* Progress Circular/Bar Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-white min-w-[220px] text-center space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-300">
            Packing Completion
          </div>
          <div className="text-3xl font-black text-white">
            {progressPct}%
          </div>
          <div className="text-xs text-slate-300">
            {packedCount} of {totalCount} items packed
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-rose-400 h-full rounded-full transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Category Pills & Filter Mode */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full custom-scrollbar">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            All Categories ({totalCount})
          </button>
          {categories.map((cat) => {
            const count = packingList.filter(p => p.category === cat).length;
            const meta = CATEGORY_META[cat];
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{meta.label}</span>
                <span className="text-[10px] opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={handleCheckAll}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1 bg-white border border-slate-200 rounded-lg"
          >
            Check All
          </button>
          <button
            onClick={handleUncheckAll}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 px-2.5 py-1 bg-white border border-slate-200 rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Add Custom Item Input Bar */}
      <form onSubmit={handleAddItem} className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            required
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add custom packing item (e.g. Swimwear, Camera Tripod)..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={newItemCat}
            onChange={(e) => setNewItemCat(e.target.value as PackingCategory)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs shrink-0 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </form>

      {/* Packing Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredItems.map((item) => {
          const meta = CATEGORY_META[item.category] || CATEGORY_META.Clothes;
          const Icon = meta.icon;

          return (
            <div
              key={item.id}
              onClick={() => handleToggleItem(item.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                item.checked
                  ? 'bg-slate-50/80 border-slate-200/60 opacity-60'
                  : 'bg-white border-slate-200/80 shadow-xs hover:border-rose-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                  item.checked
                    ? 'bg-rose-600 border-rose-600 text-white'
                    : 'border-slate-300 bg-white hover:border-slate-400'
                }`}>
                  {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>

                <div className="min-w-0">
                  <div className={`text-sm font-semibold truncate ${item.checked ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {item.item}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                    <span>{item.category}</span>
                    {item.essential && (
                      <span className="text-amber-600 font-bold bg-amber-50 px-1.5 py-0.2 rounded">
                        ★ Essential
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteItem(item.id);
                }}
                className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
                title="Remove item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
