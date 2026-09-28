import React, { useState } from 'react';
import { 
  FileCheck2, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  Plus, 
  Clock, 
  PhoneCall, 
  FileText, 
  Ticket, 
  Building2, 
  Globe2,
  Trash2
} from 'lucide-react';
import { TripPlan, DocumentItem, DocumentStatus } from '../types/trip';

interface DocumentChecklistProps {
  trip: TripPlan;
  onUpdateTrip: (updatedTrip: TripPlan) => void;
}

const STATUS_CONFIG: Record<DocumentStatus, { label: string; bg: string; text: string; border: string }> = {
  ready: { label: 'Verified & Ready', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  needed: { label: 'Action Required', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  in_progress: { label: 'Processing', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  recommended: { label: 'Recommended', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  check: { label: 'Check Eligibility', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
};

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  trip,
  onUpdateTrip
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newReq, setNewReq] = useState('');

  const documents = trip.documents || [];
  const readyCount = documents.filter(d => d.status === 'ready').length;
  const totalCount = documents.length;

  const handleToggleStatus = (docId: string) => {
    const updated = documents.map(doc => {
      if (doc.id === docId) {
        const nextStatus: DocumentStatus = doc.status === 'ready' ? 'needed' : 'ready';
        return { ...doc, status: nextStatus };
      }
      return doc;
    });
    onUpdateTrip({ ...trip, documents: updated });
  };

  const handleSaveNote = (docId: string) => {
    const updated = documents.map(doc => 
      doc.id === docId ? { ...doc, notes: noteText.trim() } : doc
    );
    onUpdateTrip({ ...trip, documents: updated });
    setEditingId(null);
    setNoteText('');
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: newTitle.trim(),
      status: 'needed',
      requirement: newReq.trim() || 'Required for travel verification',
      notes: ''
    };

    onUpdateTrip({
      ...trip,
      documents: [...documents, newDoc]
    });

    setNewTitle('');
    setNewReq('');
    setShowAddModal(false);
  };

  const handleDeleteDoc = (docId: string) => {
    const updated = documents.filter(d => d.id !== docId);
    onUpdateTrip({ ...trip, documents: updated });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-blue-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 bg-blue-900/60 border border-blue-700/60 px-2.5 py-1 rounded-full">
            Compliance & Border Readiness
          </span>
          <h2 className="text-xl sm:text-2xl font-black">
            Required Travel Documents & Passports
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Verify travel visas, validity timelines, health insurance, and local emergency embassy contacts before departure.
          </p>
          <div className="text-xs text-blue-200 bg-white/10 px-3 py-1.5 rounded-xl inline-block mt-1">
            🛂 Passport Validity Rule: Most international border entries mandate at least 6 months validity.
          </div>
        </div>

        {/* Verification Counter Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15 text-white min-w-[200px] text-center space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
            Documents Verified
          </div>
          <div className="text-3xl font-black text-white">
            {readyCount} / {totalCount}
          </div>
          <div className="text-xs text-slate-300">
            {totalCount - readyCount === 0 ? 'All documents ready!' : `${totalCount - readyCount} pending verification`}
          </div>
        </div>
      </div>

      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-blue-600" />
          Checklist Items ({documents.length})
        </h3>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" /> Add Document
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => {
          const cfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.needed;
          const isReady = doc.status === 'ready';

          return (
            <div
              key={doc.id}
              className={`rounded-2xl p-5 border transition-all ${
                isReady
                  ? 'border-emerald-200 bg-emerald-50/20 shadow-2xs'
                  : 'border-slate-200/80 bg-white shadow-xs hover:border-blue-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{doc.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{doc.requirement}</p>
                </div>

                <button
                  onClick={() => handleToggleStatus(doc.id)}
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 transition-all ${
                    isReady
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-300 hover:border-slate-400 bg-white text-transparent hover:text-slate-300'
                  }`}
                  title={isReady ? 'Mark pending' : 'Mark as ready'}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* Notes / Confirmation Section */}
              {doc.notes && (
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono flex items-center justify-between">
                  <span>Note: {doc.notes}</span>
                  <button
                    onClick={() => {
                      setEditingId(doc.id);
                      setNoteText(doc.notes || '');
                    }}
                    className="text-blue-600 hover:underline text-[11px] font-sans"
                  >
                    Edit
                  </button>
                </div>
              )}

              {editingId === doc.id ? (
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Enter passport #, ticket booking code, or note..."
                    className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-lg text-slate-800"
                  />
                  <button
                    onClick={() => handleSaveNote(doc.id)}
                    className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold"
                  >
                    Save
                  </button>
                </div>
              ) : !doc.notes && (
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setEditingId(doc.id);
                      setNoteText('');
                    }}
                    className="text-xs font-semibold text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    + Add Reference Number or Note
                  </button>
                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="text-slate-300 hover:text-rose-500 p-1 rounded"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Emergency & Embassy Contacts Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <PhoneCall className="w-5 h-5 text-teal-400" />
          <h3 className="text-base font-bold text-white">Emergency Contacts & Support</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-slate-400 block mb-0.5">Local Emergency Services</span>
            <span className="text-base font-bold text-teal-300">{trip.safetyAndEmergency?.emergencyPhone || '112'}</span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-slate-400 block mb-0.5">Local Police</span>
            <span className="text-base font-bold text-teal-300">{trip.safetyAndEmergency?.police || '110'}</span>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/10">
            <span className="text-slate-400 block mb-0.5">Nearest International Hospital</span>
            <span className="text-sm font-semibold text-white block truncate">{trip.safetyAndEmergency?.nearestHospital || 'Central Hospital'}</span>
          </div>
        </div>
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-md p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                Add Document Requirement
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddDocument} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. International Driver's Permit, Transit Visa..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Requirement Details
                </label>
                <input
                  type="text"
                  value={newReq}
                  onChange={(e) => setNewReq(e.target.value)}
                  placeholder="e.g. Needed for rental car pickup"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-900"
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
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md"
                >
                  Add Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
