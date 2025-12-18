
import React, { useState } from 'react';
import { Appointment, User, AdminNote } from '../types';
import { GoogleGenAI } from "@google/genai";

interface DevPanelProps {
  state: {
    appointments: Appointment[];
    clients: User[];
    adminNotes: AdminNote[];
  };
  onReset: () => void;
  onSeed: () => void;
}

const DevPanel: React.FC<DevPanelProps> = ({ state, onReset, onSeed }) => {
  const [aiTestPrompt, setAiTestPrompt] = useState('');
  const [aiTestResult, setAiTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testGemini = async () => {
    if (!aiTestPrompt) return;
    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: aiTestPrompt,
      });
      setAiTestResult(response.text || 'No response');
    } catch (e) {
      setAiTestResult('Error: ' + String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900 text-slate-100 rounded-2xl p-8 shadow-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Developer Control Pane</h2>
              <p className="text-slate-400 text-sm">Direct system interaction and state debugging</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onSeed}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition shadow-lg shadow-indigo-900/20"
            >
              Seed Mock Data
            </button>
            <button 
              onClick={onReset}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-lg text-sm font-bold transition"
            >
              Clear Local Storage
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* State Inspector */}
          <div className="space-y-4">
            <h3 className="text-indigo-400 font-mono text-sm uppercase tracking-widest font-bold">System State</h3>
            <div className="bg-black/50 rounded-xl p-6 font-mono text-xs overflow-auto max-h-[500px] border border-slate-800 custom-scrollbar">
              <pre className="text-emerald-400/90 leading-relaxed">
                {JSON.stringify(state, null, 2)}
              </pre>
            </div>
          </div>

          {/* AI Debugger */}
          <div className="space-y-4">
            <h3 className="text-indigo-400 font-mono text-sm uppercase tracking-widest font-bold">AI Prompt Debugger</h3>
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 space-y-4">
              <div>
                <label className="block text-slate-400 text-xs mb-2">Manual Gemini-3-Flash Request</label>
                <textarea 
                  value={aiTestPrompt}
                  onChange={(e) => setAiTestPrompt(e.target.value)}
                  placeholder="Enter a prompt to test system instructions or analysis logic..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px] transition-all"
                />
              </div>
              <button 
                onClick={testGemini}
                disabled={loading || !aiTestPrompt}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition flex items-center justify-center gap-2"
              >
                {loading ? 'Executing Request...' : 'Run Query'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>

              <div className="space-y-2">
                <label className="block text-slate-400 text-xs">Response Body</label>
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-indigo-300 min-h-[150px] whitespace-pre-wrap max-h-[250px] overflow-auto custom-scrollbar">
                  {aiTestResult || 'Results will appear here...'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex items-start gap-4">
        <div className="p-3 bg-indigo-600 text-white rounded-xl">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-indigo-900">Developer Note</h4>
          <p className="text-sm text-indigo-800/80 leading-relaxed">
            This pane is for administrative development only. Seeding data will overwrite any existing records in the current session. 
            Clearing local storage will sign you out and reset the application to its factory state.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DevPanel;
