import React, { useState } from 'react';
import { 
  Wallet, 
  Plus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Receipt, 
  Tag, 
  Calendar,
  AlertCircle,
  Plane,
  Building2,
  Utensils,
  Car,
  Ticket,
  ShoppingBag,
  ShieldAlert,
  HelpCircle,
  Check
} from 'lucide-react';
import { TripPlan, BudgetCategoryKey, ExpenseItem } from '../types/trip';

interface BudgetPlannerProps {
  trip: TripPlan;
  onUpdateTrip: (updatedTrip: TripPlan) => void;
}

const CATEGORY_META: Record<BudgetCategoryKey, { label: string; icon: any; color: string; bg: string }> = {
  transportation: { label: 'Transportation', icon: Plane, color: 'text-sky-600', bg: 'bg-sky-50' },
  hotels: { label: 'Hotels & Stay', icon: Building2, color: 'text-violet-600', bg: 'bg-violet-50' },
  food: { label: 'Food & Dining', icon: Utensils, color: 'text-orange-600', bg: 'bg-orange-50' },
  localTransport: { label: 'Local Transit', icon: Car, color: 'text-teal-600', bg: 'bg-teal-50' },
  activities: { label: 'Activities & Tickets', icon: Ticket, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  shopping: { label: 'Shopping', icon: ShoppingBag, color: 'text-pink-600', bg: 'bg-pink-50' },
  emergencyFund: { label: 'Emergency Fund', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
  miscellaneous: { label: 'Miscellaneous', icon: HelpCircle, color: 'text-slate-600', bg: 'bg-slate-50' }
};

export const BudgetPlanner: React.FC<BudgetPlannerProps> = ({
  trip,
  onUpdateTrip
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState<BudgetCategoryKey>('food');
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState<number | ''>('');
  const [newDate, setNewDate] = useState(new Date().toISOString().slice(0, 10));
  const [newNotes, setNewNotes] = useState('');

  const currency = trip.currency || 'USD';
  const totalBudget = trip.budget || 2500;
  const categories = trip.budgetBreakdown?.categories;
  const expenses = trip.budgetBreakdown?.expenses || [];

  // Calculate actual spent per category
  const actualByCategory = (catKey: BudgetCategoryKey) => {
    return expenses
      .filter(e => e.category === catKey)
      .reduce((sum, e) => sum + (e.amount || 0), 0);
  };

  const totalSpent = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const remainingBudget = totalBudget - totalSpent;
  const totalPlanned = Object.values(categories || {}).reduce((sum, c) => sum + (c.planned || c.estimated || 0), 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount || Number(newAmount) <= 0) return;

    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      category: newCategory,
      title: newTitle.trim(),
      amount: Number(newAmount),
      date: newDate,
      notes: newNotes.trim()
    };

    const updatedExpenses = [newExpense, ...expenses];
    const updatedTrip: TripPlan = {
      ...trip,
      budgetBreakdown: {
        ...trip.budgetBreakdown,
        expenses: updatedExpenses
      }
    };

    onUpdateTrip(updatedTrip);

    // Reset form
    setNewTitle('');
    setNewAmount('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const handleDeleteExpense = (expenseId: string) => {
    const updatedExpenses = expenses.filter(e => e.id !== expenseId);
    const updatedTrip: TripPlan = {
      ...trip,
      budgetBreakdown: {
        ...trip.budgetBreakdown,
        expenses: updatedExpenses
      }
    };
    onUpdateTrip(updatedTrip);
  };

  const categoryKeys: BudgetCategoryKey[] = [
    'transportation',
    'hotels',
    'food',
    'localTransport',
    'activities',
    'shopping',
    'emergencyFund',
    'miscellaneous'
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner & Summary Cards */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Trip Budget Planner & Expense Tracker
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Compare estimated, planned, and actual expenditures with real-time balance tracking.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-teal-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Total Budget
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {totalBudget.toLocaleString()} <span className="text-xs font-semibold text-slate-400">{currency}</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">Overall trip cap</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Total Planned
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {totalPlanned.toLocaleString()} <span className="text-xs font-semibold text-slate-400">{currency}</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">Pre-allocated funds</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Actual Spent
          </div>
          <div className="text-2xl font-black text-teal-700 tracking-tight">
            {totalSpent.toLocaleString()} <span className="text-xs font-semibold text-teal-600">{currency}</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">{expenses.length} logged expense{expenses.length !== 1 ? 's' : ''}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Remaining Balance
          </div>
          <div className={`text-2xl font-black tracking-tight ${remainingBudget >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {remainingBudget.toLocaleString()} <span className="text-xs font-semibold text-slate-400">{currency}</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {remainingBudget >= 0 ? 'Comfortably within budget' : 'Over budget threshold!'}
          </div>
        </div>
      </div>

      {/* Category Breakdown Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">Category Cost Breakdown</h3>
          </div>
          <span className="text-xs font-medium text-slate-400">8 Core Categories</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-4">Estimated</th>
                <th className="py-3 px-4">Planned</th>
                <th className="py-3 px-4">Actual Spent</th>
                <th className="py-3 px-4">Remaining</th>
                <th className="py-3 px-5">Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {categoryKeys.map((catKey) => {
                const meta = CATEGORY_META[catKey];
                const Icon = meta.icon;
                const catData = categories?.[catKey] || { estimated: 0, planned: 0, description: '' };
                const actual = actualByCategory(catKey);
                const planned = catData.planned || catData.estimated || 0;
                const remaining = planned - actual;
                const percent = planned > 0 ? Math.min(100, Math.round((actual / planned) * 100)) : 0;

                return (
                  <tr key={catKey} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl ${meta.bg} ${meta.color} flex items-center justify-center shrink-0`}>
                          <Icon className="w-4 h-4 stroke-[2.2]" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{meta.label}</div>
                          <div className="text-xs text-slate-400 line-clamp-1">{catData.description}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {catData.estimated.toLocaleString()} {currency}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {planned.toLocaleString()} {currency}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-teal-700">
                      {actual.toLocaleString()} {currency}
                    </td>

                    <td className={`py-3.5 px-4 font-semibold ${remaining >= 0 ? 'text-emerald-700' : 'text-rose-600 font-bold'}`}>
                      {remaining.toLocaleString()} {currency}
                    </td>

                    <td className="py-3.5 px-5 w-44">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              percent > 100 ? 'bg-rose-500' : percent > 80 ? 'bg-amber-500' : 'bg-teal-500'
                            }`}
                            style={{ width: `${Math.min(100, percent)}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600 w-8 text-right">
                          {percent}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense History List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">Recorded Expenses ({expenses.length})</h3>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Log Another Expense
          </button>
        </div>

        {expenses.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No expenses logged yet.</p>
            <p className="text-xs">Click "Add Expense" to track your real travel spending.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {expenses.map((exp) => {
              const meta = CATEGORY_META[exp.category] || CATEGORY_META.miscellaneous;
              const Icon = meta.icon;
              return (
                <div key={exp.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${meta.bg} ${meta.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{exp.title}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span>{meta.label}</span>
                        <span>·</span>
                        <span>{exp.date}</span>
                        {exp.notes && (
                          <>
                            <span>·</span>
                            <span className="italic text-slate-500">{exp.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-sm font-black text-slate-900">
                      {exp.amount.toLocaleString()} {currency}
                    </div>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="text-slate-300 hover:text-rose-500 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Remove expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-teal-600" />
                Add New Expense
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as BudgetCategoryKey)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30"
                >
                  {categoryKeys.map((key) => (
                    <option key={key} value={key}>
                      {CATEGORY_META[key].label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Expense Description *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Dinner at Trattoria, Metro Pass, Museum Ticket..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Amount ({currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value ? Number(e.target.value) : '')}
                    placeholder="0.00"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Optional Notes
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Paid in cash, receipt kept"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
