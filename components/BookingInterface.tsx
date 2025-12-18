
import React, { useState, useMemo } from 'react';
import { Service, User, Appointment, AppointmentStatus } from '../types';

interface BookingInterfaceProps {
  services: Service[];
  onBook: (app: Appointment) => void;
  user: User;
}

const BookingInterface: React.FC<BookingInterfaceProps> = ({ services, onBook, user }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('09:00');
  const [viewDate, setViewDate] = useState<Date>(new Date()); // For calendar navigation
  const [success, setSuccess] = useState(false);

  // Time slots for the demo
  const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    const newApp: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      clientId: user.id,
      clientName: user.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      status: AppointmentStatus.PENDING,
    };

    onBook(newApp);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  // Calendar Logic
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const days = [];
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    // Padding for previous month
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, currentMonth: false });
    }

    // Days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, currentMonth: true });
    }

    return days;
  }, [viewDate]);

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      viewDate.getMonth() === today.getMonth() &&
      viewDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      viewDate.getMonth() === selectedDate.getMonth() &&
      viewDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isPast = (day: number) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (day: number) => {
    if (isPast(day)) return;
    setSelectedDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 bg-indigo-600 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold">Book Your Session</h2>
            <p className="opacity-90 mt-2 text-indigo-100">Experience seamless scheduling with AI-assisted management.</p>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-x divide-slate-100">
          {/* Left Column: Service & Time Selection */}
          <div className="lg:col-span-4 p-8 space-y-8 bg-slate-50/50">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">1. Select Service</label>
              <div className="space-y-3">
                {services.map(service => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all group ${
                      selectedService?.id === service.id 
                        ? 'border-indigo-600 bg-white shadow-md' 
                        : 'border-white bg-white hover:border-indigo-200 shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-bold transition-colors ${selectedService?.id === service.id ? 'text-indigo-600' : 'text-slate-800'}`}>
                        {service.name}
                      </span>
                      <span className="text-sm font-bold text-indigo-500">${service.price}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{service.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">3. Select Time</label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2.5 px-3 text-sm font-bold rounded-xl border-2 transition-all ${
                      selectedTime === slot 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' 
                        : 'bg-white text-slate-600 border-white hover:border-indigo-100 shadow-sm'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button 
                onClick={handleBook}
                disabled={!selectedService}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 ${
                  !selectedService ? 'bg-slate-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]'
                }`}
              >
                <span>Confirm Appointment</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              {success && (
                <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-center text-sm font-bold border border-emerald-100 animate-pulse">
                  Session Booked Successfully!
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Full Calendar View */}
          <div className="lg:col-span-8 p-8">
            <label className="block text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">2. Choose Availability</label>
            
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h3 className="text-lg font-bold text-slate-800">
                  {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white rounded-lg transition-colors text-slate-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-7 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((item, index) => (
                    <div key={index} className="aspect-square relative">
                      {item.day && (
                        <button
                          onClick={() => handleDateClick(item.day!)}
                          disabled={isPast(item.day)}
                          className={`w-full h-full flex flex-col items-center justify-center rounded-xl transition-all relative ${
                            isPast(item.day) 
                              ? 'text-slate-300 cursor-not-allowed opacity-50' 
                              : isSelected(item.day)
                                ? 'bg-indigo-600 text-white shadow-md z-10 scale-105'
                                : 'hover:bg-indigo-50 text-slate-700'
                          }`}
                        >
                          <span className={`text-sm font-bold ${isToday(item.day) && !isSelected(item.day) ? 'text-indigo-600' : ''}`}>
                            {item.day}
                          </span>
                          {!isPast(item.day) && !isSelected(item.day) && (
                            <div className="mt-1 flex gap-1 justify-center">
                              <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                              <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                            </div>
                          )}
                          {isToday(item.day) && !isSelected(item.day) && (
                            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-slate-200 rounded-full"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Fully Booked</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
              <div className="p-2 bg-indigo-200 rounded-lg text-indigo-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-900">Selected Schedule:</p>
                <p className="text-sm text-indigo-800 opacity-80">
                  {selectedService?.name || 'Please select a service'} on 
                  <span className="font-bold ml-1">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span> at 
                  <span className="font-bold ml-1">{selectedTime}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingInterface;
