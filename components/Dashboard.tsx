
import React, { useState, useEffect } from 'react';
import { Appointment, User, AppointmentStatus } from '../types';
import { getSmartInsights } from '../services/geminiService';

interface DashboardProps {
  appointments: Appointment[];
  clients: User[];
  onStatusUpdate: (id: string, status: AppointmentStatus) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ appointments, clients, onStatusUpdate }) => {
  const [aiInsights, setAiInsights] = useState<string>('Generating smart insights...');
  const [loadingInsights, setLoadingInsights] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const insights = await getSmartInsights(appointments);
      setAiInsights(insights || "No insights available.");
      setLoadingInsights(false);
    };
    fetchInsights();
  }, [appointments]);

  const stats = [
    { label: 'Total Appointments', value: appointments.length, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', color: 'bg-blue-500' },
    { label: 'Total Clients', value: clients.length, icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', color: 'bg-indigo-500' },
    { label: 'Pending Requests', value: appointments.filter(a => a.status === AppointmentStatus.PENDING).length, icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-amber-500' },
    { label: 'Completed', value: appointments.filter(a => a.status === AppointmentStatus.COMPLETED).length, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'bg-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10 text-white`}>
                <svg className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                </svg>
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Upcoming Appointments</h2>
            <button className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
          </div>
          <div className="divide-y divide-slate-100">
            {appointments.slice(0, 5).map((app) => (
              <div key={app.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img src={`https://picsum.photos/seed/${app.clientId}/40/40`} className="w-10 h-10 rounded-full" alt="" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{app.clientName}</h4>
                    <p className="text-xs text-slate-500">{app.serviceName} • {app.date} @ {app.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    app.status === AppointmentStatus.CONFIRMED ? 'bg-emerald-100 text-emerald-700' :
                    app.status === AppointmentStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {app.status}
                  </span>
                  {app.status === AppointmentStatus.PENDING && (
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => onStatusUpdate(app.id, AppointmentStatus.CONFIRMED)}
                        className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <div className="bg-indigo-700 text-white rounded-xl p-6 shadow-lg relative overflow-hidden">
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-6 h-6 text-indigo-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <h2 className="text-lg font-bold">Smart Insights</h2>
            </div>
            
            <div className="flex-1 text-indigo-50 overflow-y-auto">
              {loadingInsights ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-indigo-600 rounded w-3/4"></div>
                  <div className="h-4 bg-indigo-600 rounded"></div>
                  <div className="h-4 bg-indigo-600 rounded w-5/6"></div>
                </div>
              ) : (
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  {aiInsights}
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-indigo-600">
              <p className="text-[10px] text-indigo-300 uppercase font-bold tracking-widest">Powered by Gemini AI</p>
            </div>
          </div>
          {/* Abstract background shapes */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-indigo-800 rounded-full opacity-50 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
