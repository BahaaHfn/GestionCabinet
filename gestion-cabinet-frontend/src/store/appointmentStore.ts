import { create } from 'zustand';
import api from '../api';
import { Appointment, Doctor, AppointmentStatus } from '../types';

interface AppointmentState {
  appointments: Appointment[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  doctors: Doctor[];
  loading: boolean;
  error: string | null;
  fetchAppointments: (
    status: 'upcoming' | 'finished' | 'missed',
    role?: string,
    targetId?: number,
    page?: number,
    size?: number,
    startDate?: string,
    endDate?: string
  ) => Promise<void>;
  fetchDoctors: () => Promise<void>;
  createAppointment: (request: {
    patientId: number;
    doctorId: number;
    appointmentDate: string;
    typeofIllness?: string;
    description?: string;
  }) => Promise<boolean>;
  cancelAppointment: (id: number) => Promise<boolean>;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  currentPage: 0,
  totalPages: 0,
  totalElements: 0,
  doctors: [],
  loading: false,
  error: null,

  fetchAppointments: async (status, role, targetId, page = 0, size = 10, startDate = '', endDate = '') => {
    set({ loading: true, error: null });
    try {
      let url = '/appointments/upcoming';
      if (status === 'finished') {
        url = '/appointments/finished';
      } else if (status === 'missed') {
        url = '/appointments/missed';
      }
      
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('size', size.toString());
      
      if (role === 'DOCTOR' && targetId) {
        params.append('doctorId', targetId.toString());
      } else if (role === 'PATIENT' && targetId) {
        params.append('patientId', targetId.toString());
      }
      
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get<any>(`${url}?${params.toString()}`);
      const pageData = response.data;
      const dtoList = pageData.content || [];
      
      const mapped = dtoList.map((dto: any) => ({
        idAppointment: dto.idAppointment,
        dateOfAppointment: dto.dateOfAppointment,
        dateOfChecking: dto.dateOfChecking,
        typeOfIllness: dto.typeOfIllness,
        description: dto.description,
        status: dto.status as AppointmentStatus,
        notification: dto.notification,
        notes: dto.notes,
        patient: {
          idPatient: dto.patientId,
          user: {
            idUser: 0,
            firstName: dto.patientFirstName || '',
            lastName: dto.patientLastName || '',
            email: '',
            accountType: 'PATIENT' as any
          }
        } as any,
        doctor: {
          idDoctor: dto.doctorId,
          specialty: dto.doctorSpecialty || '',
          user: {
            idUser: 0,
            firstName: dto.doctorFirstName || '',
            lastName: dto.doctorLastName || '',
            email: '',
            accountType: 'DOCTOR' as any
          }
        } as any
      }));

      set({ 
        appointments: mapped, 
        currentPage: pageData.number || 0,
        totalPages: pageData.totalPages || 0,
        totalElements: pageData.totalElements || 0,
        loading: false 
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchDoctors: async () => {
    try {
      const response = await api.get<Doctor[]>('/doctors/all');
      set({ doctors: response.data });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  createAppointment: async (request) => {
    set({ loading: true, error: null });
    try {
      await api.post('/appointments', request);
      set({ loading: false });
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data || err.message || 'Time slot conflict or error';
      set({ error: typeof errMsg === 'string' ? errMsg : 'Conflict or booking error', loading: false });
      return false;
    }
  },

  cancelAppointment: async (id) => {
    try {
      await api.delete(`/appointments/${id}`);
      set({ appointments: get().appointments.filter(a => a.idAppointment !== id) });
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  }
}));
