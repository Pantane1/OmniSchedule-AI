
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CLIENT = 'CLIENT'
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

export interface AdminNote {
  id: string;
  clientId: string;
  text: string;
  createdAt: string; // ISO string
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  serviceName: string;
  date: string; // ISO date
  time: string; // 24h format
  status: AppointmentStatus;
  notes?: string;
}

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description: string;
}

export interface AppState {
  currentUser: User | null;
  appointments: Appointment[];
  services: Service[];
  clients: User[];
  adminNotes: AdminNote[];
}
