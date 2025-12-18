
import { UserRole, Service, AppointmentStatus, Appointment } from './types';

export const APP_NAME = "OmniSchedule AI";

export const MOCK_SERVICES: Service[] = [
  { id: '1', name: 'Business Consultation', duration: 60, price: 150, description: 'Strategic planning session for business growth.' },
  { id: '2', name: 'Tech Audit', duration: 45, price: 100, description: 'A thorough review of your current technology stack.' },
  { id: '3', name: 'General Coaching', duration: 30, price: 75, description: 'One-on-one session focused on professional goals.' },
  { id: '4', name: 'Project Kickoff', duration: 90, price: 200, description: 'In-depth planning for new client projects.' },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    clientId: 'c1',
    clientName: 'Sarah Jenkins',
    serviceId: '1',
    serviceName: 'Business Consultation',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    status: AppointmentStatus.CONFIRMED,
  },
  {
    id: 'a2',
    clientId: 'c2',
    clientName: 'Michael Chen',
    serviceId: '2',
    serviceName: 'Tech Audit',
    date: new Date().toISOString().split('T')[0],
    time: '11:00',
    status: AppointmentStatus.PENDING,
  },
  {
    id: 'a3',
    clientId: 'c3',
    clientName: 'Amanda Ray',
    serviceId: '3',
    serviceName: 'General Coaching',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    status: AppointmentStatus.CONFIRMED,
  }
];

export const MOCK_CLIENTS = [
  { id: 'c1', name: 'Sarah Jenkins', email: 'sarah@example.com', role: UserRole.CLIENT, phone: '555-0101' },
  { id: 'c2', name: 'Michael Chen', email: 'michael@example.com', role: UserRole.CLIENT, phone: '555-0102' },
  { id: 'c3', name: 'Amanda Ray', email: 'amanda@example.com', role: UserRole.CLIENT, phone: '555-0103' },
  { id: 'c4', name: 'Robert Fox', email: 'robert@example.com', role: UserRole.CLIENT, phone: '555-0104' },
];
