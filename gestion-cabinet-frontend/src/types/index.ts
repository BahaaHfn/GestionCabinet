export enum AccountType {
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
  ADMIN = 'ADMIN',
  RECEPTIONIST = 'RECEPTIONIST'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export interface User {
  idUser: number;
  cin?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  email: string;
  accountType: AccountType;
  createdAt?: string;
  updatedAt?: string;
}

export interface Patient {
  idPatient: number;
  user: User;
  birthDate?: string;
  sex?: Gender;
  bloodType?: string;
  allergies?: string;
  medicalConditions?: string;
  insuranceNumber?: string;
  emergencyContact?: string;
}

export interface Doctor {
  idDoctor: number;
  user: User;
  specialty: string;
  licenseNumber: string;
  officePhone?: string;
  officeAddress?: string;
  yearsOfExperience?: number;
  isAvailable: boolean;
}

export interface Appointment {
  idAppointment: number;
  patient: Patient;
  doctor: Doctor;
  dateOfAppointment: string;
  dateOfChecking?: string;
  typeOfIllness?: string;
  description?: string;
  status: AppointmentStatus;
  notification: boolean;
  notes?: string;
  createdAt?: string;
}

export interface Prescription {
  idPrescription: number;
  consultation: Consultation;
  patient: Patient;
  doctor?: Doctor;
  medicationName: string;
  dosage: string;
  frequency: string;
  durationDays?: number;
  instructions?: string;
  datePrescribed?: string;
  isActive: boolean;
}

export interface Consultation {
  idConsultation: number;
  appointment: Appointment;
  patient: Patient;
  doctor?: Doctor;
  date: string;
  description?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  followUpDate?: string;
  prescriptions?: Prescription[];
  createdAt?: string;
}

export interface MedicalFile {
  idMedicalFile: number;
  patient: Patient;
  totalConsultations: number;
  lastConsultationDate?: string;
  bloodType?: string;
  chronicDiseases?: string;
  surgeries?: string;
  vaccinations?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalConsultations: number;
  consultationsThisMonth: number;
  specialtyDistribution: { [key: string]: number };
}

export interface ConsultationTrend {
  month: string;
  consultations: number;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface AuthResponse {
  token: string;
  idUser: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  targetId?: number;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  cin?: string;
  accountType: string;
  specialty?: string;
  licenseNumber?: string;
  officePhone?: string;
  officeAddress?: string;
  yearsOfExperience?: number;
  birthDate?: string;
  sex?: string;
  bloodType?: string;
  allergies?: string;
  medicalConditions?: string;
  insuranceNumber?: string;
  emergencyContact?: string;
}
