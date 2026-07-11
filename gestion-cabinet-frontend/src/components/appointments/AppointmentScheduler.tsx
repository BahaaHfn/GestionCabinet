import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAppointmentStore } from '../../store/appointmentStore';
import { useAuthStore } from '../../store/authStore';
import api from '../../api';
import { Patient } from '../../types';
import { CalendarDays, User, Stethoscope, FileQuestion, Clock } from 'lucide-react';

interface AppointmentSchedulerProps {
  onSuccess?: () => void;
}

export const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({ onSuccess }) => {
  const { user } = useAuthStore();
  const { doctors, fetchDoctors, createAppointment, error } = useAppointmentStore();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDoctorId, setSelectedDoctorId] = useState<number>(0);
  const [patientId, setPatientId] = useState<number>(0);
  const [typeofIllness, setTypeofIllness] = useState('');
  const [description, setDescription] = useState('');
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // Free Slots state
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  useEffect(() => {
    fetchDoctors();
    if (user && user.role !== 'PATIENT') {
      api.get<Patient[]>('/patients/all').then(res => {
        setPatients(res.data);
        if (res.data.length > 0) {
          setPatientId(res.data[0].idPatient);
        }
      });
    } else if (user && user.role === 'PATIENT') {
      setPatientId(user.targetId || 0);
    }
  }, [user]);

  useEffect(() => {
    if (doctors.length > 0 && selectedDoctorId === 0) {
      setSelectedDoctorId(doctors[0].idDoctor);
    }
  }, [doctors]);

  // Load and calculate free slots
  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) return;

    const loadSlots = async () => {
      try {
        const schedRes = await api.get<any[]>(`/doctors/${selectedDoctorId}/schedules`);
        const apptsRes = await api.get<any[]>(`/appointments/doctor/${selectedDoctorId}`);
        
        const schedules = schedRes.data;
        const appts = apptsRes.data;

        // JS getDay() is 0=Sunday, 1=Monday, ..., 6=Saturday
        // We map to backend: 0=Monday, ..., 6=Sunday
        const jsDay = selectedDate.getDay();
        const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1;

        let startTime = "08:00";
        let endTime = "18:00";
        let slotDuration = 30;
        let worksThisDay = false;

        if (schedules.length === 0) {
          // Default standard work hours: Mon-Fri 8:00 to 18:00
          if (dayOfWeek >= 0 && dayOfWeek <= 4) {
            worksThisDay = true;
          }
        } else {
          const daySched = schedules.find(s => s.dayOfWeek === dayOfWeek);
          if (daySched) {
            startTime = daySched.startTime.substring(0, 5); // "HH:mm"
            endTime = daySched.endTime.substring(0, 5);
            slotDuration = daySched.slotDuration || 30;
            worksThisDay = true;
          }
        }

        if (!worksThisDay) {
          setAvailableSlots([]);
          setSelectedSlot('');
          return;
        }

        // Generate slots
        const slots: string[] = [];
        let current = parseTimeToMinutes(startTime);
        const end = parseTimeToMinutes(endTime);

        while (current + slotDuration <= end) {
          slots.push(formatMinutesToTime(current));
          current += slotDuration;
        }

        // Filter out slots matching existing non-cancelled appointments
        const localDateStr = selectedDate.toLocaleDateString('en-CA'); // YYYY-MM-DD
        const activeAppts = appts.filter((a: any) => {
          if (!a.dateOfAppointment) return false;
          if (a.status === 'CANCELLED') return false;
          const aDateStr = a.dateOfAppointment.split('T')[0];
          return aDateStr === localDateStr;
        });

        const freeSlots = slots.filter(slot => {
          return !activeAppts.some((a: any) => {
            const aTime = a.dateOfAppointment.split('T')[1].substring(0, 5); // "HH:mm"
            return aTime === slot;
          });
        });

        setAvailableSlots(freeSlots);
        if (freeSlots.length > 0) {
          setSelectedSlot(freeSlots[0]);
        } else {
          setSelectedSlot('');
        }
      } catch (err) {
        console.error('Error loading doctor slots:', err);
      }
    };

    loadSlots();
  }, [selectedDoctorId, selectedDate]);

  const parseTimeToMinutes = (timeStr: string): number => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const formatMinutesToTime = (totalMins: number): string => {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg(null);
    setLocalError(null);

    if (!selectedDoctorId) {
      setLocalError('Please select a doctor.');
      setSubmitting(false);
      return;
    }
    if (!patientId) {
      setLocalError('Please select a patient.');
      setSubmitting(false);
      return;
    }
    if (!selectedSlot) {
      setLocalError('Doctor is not available at any slots on this day.');
      setSubmitting(false);
      return;
    }

    const appointmentDateTime = new Date(selectedDate);
    const [hour, minute] = selectedSlot.split(':').map(Number);
    appointmentDateTime.setHours(hour, minute, 0, 0);

    const payload = {
      patientId,
      doctorId: selectedDoctorId,
      appointmentDate: appointmentDateTime.toISOString(),
      typeofIllness,
      description
    };

    const success = await createAppointment(payload);
    if (success) {
      setSuccessMsg('Appointment booked successfully!');
      setTypeofIllness('');
      setDescription('');
      if (onSuccess) onSuccess();
    } else {
      setLocalError(error || 'Booking failed. Time slot may be conflicted.');
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <CalendarDays size={20} className="text-sky-500" />
          Schedule an Appointment
        </h3>
      </div>
      
      <form onSubmit={handleSchedule} className="p-6 space-y-6">
        {successMsg && (
          <div className="p-4 bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200 rounded-lg">
            {successMsg}
          </div>
        )}
        {localError && (
          <div className="p-4 bg-rose-50 text-rose-700 text-sm font-medium border border-rose-200 rounded-lg">
            {localError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Picker */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Select Date</label>
            <Calendar 
              onChange={(d: any) => setSelectedDate(d as Date)} 
              value={selectedDate}
              minDate={new Date()}
              className="border border-slate-200 rounded-lg"
            />
          </div>

          {/* Details Form */}
          <div className="space-y-4">
            {/* Patient Select (Admins/Doctors only) */}
            {user && user.role !== 'PATIENT' && (
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <User size={16} className="text-slate-400" />
                  Select Patient
                </label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm bg-white shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                >
                  {patients.map(p => (
                    <option key={p.idPatient} value={p.idPatient}>
                      {p.user.firstName} {p.user.lastName} ({p.user.cin || 'No CIN'})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Doctor Select */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1">
                <Stethoscope size={16} className="text-slate-400" />
                Select Doctor
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm bg-white shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
              >
                {doctors.map(d => (
                  <option key={d.idDoctor} value={d.idDoctor}>
                    Dr. {d.user.firstName} {d.user.lastName} ({d.specialty})
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slot Select */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1">
                <Clock size={16} className="text-slate-400" />
                Available Slots
              </label>
              {availableSlots.length === 0 ? (
                <div className="text-xs text-rose-500 font-semibold p-2 bg-rose-50 border border-rose-100 rounded-lg">
                  Doctor has no available time slots on this day.
                </div>
              ) : (
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-sm bg-white shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
                >
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Illness Type */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 flex items-center gap-1">
                <FileQuestion size={16} className="text-slate-400" />
                Reason for Appointment
              </label>
              <input
                type="text"
                value={typeofIllness}
                onChange={(e) => setTypeofIllness(e.target.value)}
                placeholder="e.g. Cardiological Checkup"
                required
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700">Detailed Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Enter symptoms or checkup notes..."
                className="w-full rounded-lg border border-slate-200 p-2.5 text-sm shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || availableSlots.length === 0}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-sky-100 transition-all disabled:bg-sky-400"
            >
              {submitting ? 'Scheduling...' : 'Confirm Appointment'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
