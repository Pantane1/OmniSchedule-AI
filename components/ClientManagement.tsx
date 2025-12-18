
import React, { useState } from 'react';
import { User, Appointment, AdminNote } from '../types';
import { getSmartSummary } from '../services/geminiService';

interface ClientManagementProps {
  clients: User[];
  appointments: Appointment[];
  adminNotes: AdminNote[];
  onAddNote: (clientId: string, text: string) => void;
  onDeleteNote: (id: string) => void;
}

const ClientManagement: React.FC<ClientManagementProps> = ({ clients, appointments, adminNotes, onAddNote, onDeleteNote }) => {
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  const handleSelectClient = async (client: User) => {
    setSelectedClient(client);
    setLoadingSummary(true);
    setSummary('');
    const history = appointments.filter(a => a.clientId === client.id);
    const result = await getSmartSummary(client.name, history);
    setSummary(result);
    setLoadingSummary(false);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !newNoteText.trim()) return;
    onAddNote(selectedClient.id, newNoteText.trim());
    setNewNoteText('');
  };

  const clientNotes = selectedClient 
    ? adminNotes.filter(n => n.clientId === selectedClient.id)
    : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-100 h-fit">
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-bold text-slate-800">Client List</h2>
        </div>
        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {clients.map(client => (
            <button
              key={client.id}
              onClick={() => handleSelectClient(client)}
              className={`w-full p-4 flex items-center text-left hover:bg-slate-50 transition-colors ${selectedClient?.id === client.id ? 'bg-indigo-50 border-r-4 border-indigo-500' : ''}`}
            >
              <img src={client.avatar || `https://picsum.photos/seed/${client.id}/40/40`} className="w-10 h-10 rounded-full mr-3" alt="" />
              <div>
                <p className="font-semibold text-slate-800">{client.name}</p>
                <p className="text-xs text-slate-500">{client.email}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2">
        {selectedClient ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <img src={`https://picsum.photos/seed/${selectedClient.id}/80/80`} className="w-20 h-20 rounded-full border-4 border-white shadow-md" alt="" />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-slate-800">{selectedClient.name}</h2>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">ID: {selectedClient.id}</span>
                  </div>
                  <p className="text-slate-500">{selectedClient.phone || 'No phone number'}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm">Edit Profile</button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* AI Summary Section */}
              <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
                <div className="flex items-center space-x-2 mb-4">
                   <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.243a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM6.343 15.657a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707z" />
                    </svg>
                   </div>
                   <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider">AI Client Insight</h3>
                </div>
                {loadingSummary ? (
                   <div className="animate-pulse space-y-2">
                     <div className="h-4 bg-indigo-200/50 rounded w-full"></div>
                     <div className="h-4 bg-indigo-200/50 rounded w-2/3"></div>
                   </div>
                ) : (
                  <p className="text-indigo-900/80 italic font-medium leading-relaxed">"{summary}"</p>
                )}
              </div>

              {/* Private Admin Notes Section */}
              <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                   <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 uppercase tracking-tighter opacity-40">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Admin Only
                   </span>
                </div>
                <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Private Business Notes
                </h3>
                
                <form onSubmit={handleAddNote} className="mb-6">
                  <textarea 
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Type a confidential note about this client..."
                    className="w-full bg-white border border-amber-200 rounded-lg p-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-amber-400 min-h-[80px] transition-all"
                  />
                  <div className="flex justify-end mt-2">
                    <button 
                      type="submit"
                      disabled={!newNoteText.trim()}
                      className="px-4 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 disabled:opacity-50 transition shadow-sm"
                    >
                      Save Private Note
                    </button>
                  </div>
                </form>

                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                  {clientNotes.map(note => (
                    <div key={note.id} className="bg-white/60 p-3 rounded-lg border border-amber-100 group">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold text-amber-600/60 uppercase">
                          {new Date(note.createdAt).toLocaleDateString()} @ {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button 
                          onClick={() => onDeleteNote(note.id)}
                          className="opacity-0 group-hover:opacity-100 text-amber-400 hover:text-red-500 transition-all p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-amber-900 leading-snug">{note.text}</p>
                    </div>
                  ))}
                  {clientNotes.length === 0 && (
                    <p className="text-center py-4 text-xs text-amber-600/60 italic font-medium">No private notes yet.</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Appointment History
                </h3>
                <div className="bg-white border border-slate-100 rounded-lg overflow-hidden shadow-sm">
                  <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Service</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {appointments
                        .filter(a => a.clientId === selectedClient.id)
                        .map(app => (
                          <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{app.serviceName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{app.date} <span className="text-xs text-slate-300 ml-1">{app.time}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                app.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 
                                app.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      }
                      {appointments.filter(a => a.clientId === selectedClient.id).length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-6 py-12 text-center text-slate-400 text-sm italic">No past appointments recorded.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center bg-white rounded-xl border-2 border-dashed border-slate-200 p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <svg className="h-10 w-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-bold text-slate-800">No client selected</h3>
              <p className="mt-1 text-sm text-slate-500 max-w-xs mx-auto">Select a client from the list to view their history, private notes, and AI-generated insights.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManagement;
