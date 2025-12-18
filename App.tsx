
import React, { useState, useEffect, useCallback } from 'react';
import { User, UserRole, Appointment, Service, AppointmentStatus, AdminNote } from './types';
import { MOCK_APPOINTMENTS, MOCK_SERVICES, MOCK_CLIENTS } from './constants';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import ClientManagement from './components/ClientManagement';
import AppointmentsList from './components/AppointmentsList';
import BookingInterface from './components/BookingInterface';
import Login from './components/Login';
import DevPanel from './components/DevPanel';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services] = useState<Service[]>(MOCK_SERVICES);
  const [clients, setClients] = useState<User[]>(MOCK_CLIENTS);
  const [adminNotes, setAdminNotes] = useState<AdminNote[]>([]);

  useEffect(() => {
    // Load local storage or default mocks
    const savedApps = localStorage.getItem('omni_appointments');
    if (savedApps) {
      setAppointments(JSON.parse(savedApps));
    } else {
      setAppointments(MOCK_APPOINTMENTS);
    }

    const savedNotes = localStorage.getItem('omni_admin_notes');
    if (savedNotes) {
      setAdminNotes(JSON.parse(savedNotes));
    }

    const user = localStorage.getItem('omni_user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('omni_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('omni_user');
  };

  const updateAppointments = useCallback((newApps: Appointment[]) => {
    setAppointments(newApps);
    localStorage.setItem('omni_appointments', JSON.stringify(newApps));
  }, []);

  const addAppointment = (app: Appointment) => {
    const updated = [app, ...appointments];
    updateAppointments(updated);
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    const updated = appointments.map(a => a.id === id ? { ...a, status } : a);
    updateAppointments(updated);
  };

  const addAdminNote = (clientId: string, text: string) => {
    const newNote: AdminNote = {
      id: Math.random().toString(36).substr(2, 9),
      clientId,
      text,
      createdAt: new Date().toISOString(),
    };
    const updated = [newNote, ...adminNotes];
    setAdminNotes(updated);
    localStorage.setItem('omni_admin_notes', JSON.stringify(updated));
  };

  const deleteAdminNote = (id: string) => {
    const updated = adminNotes.filter(n => n.id !== id);
    setAdminNotes(updated);
    localStorage.setItem('omni_admin_notes', JSON.stringify(updated));
  };

  const resetAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const seedMockData = () => {
    setAppointments(MOCK_APPOINTMENTS);
    setAdminNotes([]);
    localStorage.setItem('omni_appointments', JSON.stringify(MOCK_APPOINTMENTS));
    localStorage.removeItem('omni_admin_notes');
    alert('Mock data seeded successfully.');
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        role={currentUser.role}
      />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Welcome, {currentUser.name}
            </h1>
            <p className="text-slate-500">Managing your schedule for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${currentUser.role === UserRole.ADMIN ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {currentUser.role}
            </span>
            <img src={currentUser.avatar || `https://picsum.photos/seed/${currentUser.id}/40/40`} className="w-10 h-10 rounded-full border border-slate-200" alt="avatar" />
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard 
              appointments={appointments} 
              clients={clients} 
              onStatusUpdate={updateAppointmentStatus}
            />
          )}
          {activeTab === 'appointments' && (
            <AppointmentsList 
              appointments={appointments} 
              onStatusUpdate={updateAppointmentStatus}
              role={currentUser.role}
              clientId={currentUser.id}
            />
          )}
          {activeTab === 'booking' && (
            <BookingInterface 
              services={services} 
              onBook={addAppointment}
              user={currentUser}
            />
          )}
          {activeTab === 'clients' && (
            <ClientManagement 
              clients={clients} 
              appointments={appointments}
              adminNotes={adminNotes}
              onAddNote={addAdminNote}
              onDeleteNote={deleteAdminNote}
            />
          )}
          {activeTab === 'dev' && (
            <DevPanel 
              state={{ appointments, clients, adminNotes }}
              onReset={resetAllData}
              onSeed={seedMockData}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
