
import React, { useState } from 'react';
import { Appointment, UserRole, AppointmentStatus } from '../types';

interface AppointmentsListProps {
  appointments: Appointment[];
  onStatusUpdate: (id: string, status: AppointmentStatus) => void;
  role: UserRole;
  clientId: string;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ appointments, onStatusUpdate, role, clientId }) => {
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const filteredApps = role === UserRole.CLIENT 
    ? appointments.filter(a => a.clientId === clientId)
    : appointments;

  const handleExportCSV = () => {
    setExporting(true);
    
    // CSV Header
    const headers = ['Client Name', 'Service Name', 'Date', 'Time', 'Status'];
    
    // CSV Rows - Robust escaping for CSV standard
    const rows = filteredApps.map(app => [
      `"${(app.clientName || '').replace(/"/g, '""')}"`,
      `"${(app.serviceName || '').replace(/"/g, '""')}"`,
      app.date,
      app.time,
      app.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    // Create Blob and Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `omnischedule-appointments-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // UX Feedback
    setExporting(false);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {role === UserRole.ADMIN ? 'Manage All Appointments' : 'My Scheduled Sessions'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {filteredApps.length} {filteredApps.length === 1 ? 'appointment' : 'appointments'} listed
          </p>
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <button 
            onClick={handleExportCSV}
            disabled={exporting || filteredApps.length === 0}
            className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm border ${
              exportSuccess 
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            } ${filteredApps.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {exportSuccess ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                Downloaded
              </>
            ) : (
              <>
                <svg className={`w-4 h-4 mr-2 ${exporting ? 'animate-bounce' : 'text-indigo-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {exporting ? 'Processing...' : 'Export CSV'}
              </>
            )}
          </button>
          <select className="flex-1 sm:flex-none px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
            <option>All Status</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/50">
            <tr>
              {role === UserRole.ADMIN && <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Client</th>}
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredApps.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                {role === UserRole.ADMIN && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img src={`https://picsum.photos/seed/${app.clientId}/32/32`} className="w-8 h-8 rounded-full mr-3 border border-slate-100 shadow-sm" alt="" />
                      <span className="text-sm font-medium text-slate-900">{app.clientName}</span>
                    </div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-slate-800">{app.serviceName}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-800 font-medium">{app.date}</div>
                  <div className="text-xs text-slate-400">{app.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                    app.status === AppointmentStatus.CONFIRMED ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    app.status === AppointmentStatus.PENDING ? 'bg-amber-50 text-amber-700 border-amber-100' :
                    app.status === AppointmentStatus.CANCELLED ? 'bg-red-50 text-red-700 border-red-100' :
                    'bg-slate-50 text-slate-700 border-slate-200'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {role === UserRole.ADMIN && app.status === AppointmentStatus.PENDING && (
                    <div className="flex justify-end space-x-1">
                      <button 
                        onClick={() => onStatusUpdate(app.id, AppointmentStatus.CONFIRMED)}
                        className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all"
                        title="Confirm"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button 
                         onClick={() => onStatusUpdate(app.id, AppointmentStatus.CANCELLED)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                        title="Cancel"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                  {role === UserRole.CLIENT && app.status === AppointmentStatus.PENDING && (
                     <button 
                      onClick={() => onStatusUpdate(app.id, AppointmentStatus.CANCELLED)}
                      className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-transparent hover:border-red-100"
                     >
                        Cancel Booking
                     </button>
                  )}
                  {app.status !== AppointmentStatus.PENDING && (
                    <span className="text-slate-400 italic text-xs">No actions</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredApps.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-24 text-center">
                   <div className="flex flex-col items-center">
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                       <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                       </svg>
                     </div>
                     <p className="text-slate-500 font-medium">No appointments found</p>
                     <p className="text-slate-400 text-sm">Appointments will appear here once they are booked.</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsList;
