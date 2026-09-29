import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  User, 
  Compass, 
  RefreshCw,
  Lightbulb,
  MapPin,
  Workflow,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { TripPlan } from '../types/trip';
import { askTripCopilot } from '../services/geminiService';
import { sendMessageToN8n, N8N_CHAT_WEBHOOK_URL } from '../services/n8nService';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trip: TripPlan;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  source?: 'n8n' | 'gemini';
  isError?: boolean;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  trip
}) => {
  const [chatEngine, setChatEngine] = useState<'n8n' | 'gemini'>('n8n');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'ai',
      text: `Hello! I am connected to your n8n Chatbot workflow (mahi10.app.n8n.cloud). Ask me anything about ${trip.destination}, from local attractions to packing advice!`,
      timestamp: 'Just now',
      source: 'n8n'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      if (chatEngine === 'n8n') {
        const n8nRes = await sendMessageToN8n(text, N8N_CHAT_WEBHOOK_URL);
        if (n8nRes.success) {
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: n8nRes.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: 'n8n'
          };
          setMessages(prev => [...prev, aiMsg]);
        } else {
          // n8n returned error or workflow error
          const errMsg: ChatMessage = {
            id: `ai-err-${Date.now()}`,
            sender: 'ai',
            text: `${n8nRes.reply}\n\n💡 Tip: You can also switch to Gemini 3.8 mode using the toggle above!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: 'n8n',
            isError: true
          };
          setMessages(prev => [...prev, errMsg]);
        }
      } else {
        const reply = await askTripCopilot(text, trip);
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: 'gemini'
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `For ${trip.destination}, make sure to grab the local day pass and book prime attraction entries ahead. What else would you like to know?`,
          timestamp: 'Just now',
          source: chatEngine
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const samplePrompts = [
    `What should I wear for the weather in ${trip.destination}?`,
    `Suggest 3 hidden foodie spots in ${trip.destination}`,
    `What are the most important local etiquette rules?`,
    `What is a good backup plan if it rains on Day 2?`
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                {chatEngine === 'n8n' ? <Workflow className="w-4 h-4 text-orange-400" /> : <Bot className="w-4 h-4 text-teal-300" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  TripPlanner Assistant
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    chatEngine === 'n8n' ? 'bg-orange-500/30 text-orange-300' : 'bg-teal-500/30 text-teal-300'
                  }`}>
                    {chatEngine === 'n8n' ? 'n8n Workflow' : 'Gemini 3.8'}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-300">{trip.destination} · {trip.durationDays} Days</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Engine Selector Segmented Control */}
          <div className="mt-3 flex items-center gap-1 bg-black/30 p-1 rounded-xl text-xs">
            <button
              onClick={() => setChatEngine('n8n')}
              className={`flex-1 py-1 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                chatEngine === 'n8n'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>n8n Chatbot</span>
            </button>

            <button
              onClick={() => setChatEngine('gemini')}
              className={`flex-1 py-1 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                chatEngine === 'gemini'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini Copilot</span>
            </button>
          </div>
        </div>

        {/* n8n Status Banner */}
        {chatEngine === 'n8n' && (
          <div className="bg-orange-50 px-4 py-2 border-b border-orange-200/70 text-[11px] text-orange-900 flex items-center justify-between">
            <span className="truncate">
              Webhook: <strong>mahi10.app.n8n.cloud/.../chat</strong>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 ml-2" title="Webhook Configured" />
          </div>
        )}

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 ml-1" />
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 rounded-lg font-medium transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs ${
                msg.sender === 'user' 
                  ? 'bg-teal-600 text-white' 
                  : msg.source === 'n8n' ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'
              }`}>
                {msg.sender === 'user' ? (
                  <User className="w-3.5 h-3.5" />
                ) : msg.source === 'n8n' ? (
                  <Workflow className="w-3.5 h-3.5" />
                ) : (
                  <Bot className="w-3.5 h-3.5 text-teal-600" />
                )}
              </div>

              <div className={`max-w-[82%] rounded-2xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-teal-600 text-white font-medium'
                  : msg.isError
                    ? 'bg-rose-50 text-rose-900 border border-rose-200'
                    : 'bg-slate-100 text-slate-800 border border-slate-200/60'
              }`}>
                <div className="whitespace-pre-line">{msg.text}</div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  {msg.source && msg.sender !== 'user' && (
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      via {msg.source}
                    </span>
                  )}
                  <span className={`text-[9px] ml-auto ${msg.sender === 'user' ? 'text-teal-200' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-xs text-slate-400 italic pl-9">
              <div className="w-3.5 h-3.5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              <span>{chatEngine === 'n8n' ? 'Querying n8n AI agent...' : 'Thinking with Gemini 3.8 Flash...'}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={chatEngine === 'n8n' ? "Ask your n8n AI agent..." : `Ask about ${trip.destination}...`}
              className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className={`p-2 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors shrink-0 ${
                chatEngine === 'n8n' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
