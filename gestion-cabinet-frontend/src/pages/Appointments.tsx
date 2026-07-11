import React, { useEffect, useState } from 'react';
import { useAppointmentStore } from '../store/appointmentStore';
import { useAuthStore } from '../store/authStore';
import { AppointmentScheduler } from '../components/appointments/AppointmentScheduler';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { AppointmentStatus } from '../types';
import { CalendarRange, Trash2, Clock, CheckSquare, PlusCircle, Calendar, AlertCircle } from 'lucide-react';
import api from '../api';

export const Appointments: React.FC = () => {
  const { user } = useAuthStore();
  const {
    appointments,
    currentPage,
    totalPages,
    loading,
    fetchAppointments,
    cancelAppointment
  } = useAppointmentStore();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'finished' | 'missed' | 'schedule'>('upcoming');
  const [page, setPage] = useState(0);
  const [filterDate, setFilterDate] = useState('');

  // Consultation and Prescription states
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [typeofIllness, setTypeofIllness] = useState('');
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [durationDays, setDurationDays] = useState(7);

  useEffect(() => {
    if (user && activeTab !== 'schedule') {
      const isPatient = user.role === 'PATIENT';

      let startParam = '';
      let endParam = '';
      if (filterDate) {
        startParam = `${filterDate}T00:00:00`;
        endParam = `${filterDate}T23:59:59`;
      }

      fetchAppointments(
        activeTab === 'finished' ? 'finished' : activeTab === 'missed' ? 'missed' : 'upcoming',
        isPatient ? 'PATIENT' : undefined,
        isPatient ? user.targetId : undefined,
        page,
        10,
        startParam,
        endParam
      );
    }
  }, [user, activeTab, page, filterDate]);

  const handleCancel = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this appointment slot?')) return;
    const success = await cancelAppointment(id);
    if (success) {
      alert('Appointment cancelled successfully.');
    }
  };

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;
    try {
      await api.post(`/appointments/${selectedAppt.idAppointment}/complete`, {
        diagnosis,
        typeOfIllness: typeofIllness,
        medicationName: medName,
        dosage,
        frequency,
        durationDays
      });
      alert('Consultation and prescription recorded successfully!');
      setCompleteModalOpen(false);
      // Reset form
      setDiagnosis('');
      setTypeofIllness('');
      setMedName('');
      setDosage('');
      setFrequency('');
      setDurationDays(7);

      // Refresh list
      const isPatient = user?.role === 'PATIENT';
      fetchAppointments(
        activeTab === 'finished' ? 'finished' : 'upcoming',
        isPatient ? 'PATIENT' : undefined,
        isPatient ? user?.targetId : undefined,
        page,
        10
      );
    } catch (err: any) {
      alert(err.response?.data || 'Failed to complete appointment');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Appointment Scheduling Center</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Book, review, and cancel consultation sessions.</p>
      </div>

      {/* Tabs bar */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab('upcoming');
            setPage(0);
          }}
          className={`flex items-center gap-1.5 py-3 px-4 font-bold text-sm border-b-2 transition-all ${activeTab === 'upcoming'
              ? 'border-sky-500 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
          <Clock size={16} /> Upcoming Sessions
        </button>
        <button
          onClick={() => {
            setActiveTab('finished');
            setPage(0);
          }}
          className={`flex items-center gap-1.5 py-3 px-4 font-bold text-sm border-b-2 transition-all ${activeTab === 'finished'
              ? 'border-sky-500 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
          <CheckSquare size={16} /> Finished Sessions
        </button>
        <button
          onClick={() => {
            setActiveTab('missed');
            setPage(0);
          }}
          className={`flex items-center gap-1.5 py-3 px-4 font-bold text-sm border-b-2 transition-all ${activeTab === 'missed'
              ? 'border-sky-500 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
        >
          <AlertCircle size={16} /> Missed Sessions
        </button>
        {user && user.role !== 'DOCTOR' && (
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-1.5 py-3 px-4 font-bold text-sm border-b-2 transition-all ${activeTab === 'schedule'
                ? 'border-sky-500 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
          >
            <PlusCircle size={16} /> Book Appointment
          </button>
        )}
      </div>

      {/* Date Filter Panel */}
      {activeTab !== 'schedule' && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-end gap-4">
          <div className="w-full sm:w-auto flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
              <Calendar size={12} className="text-slate-400" /> Filter by Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                setPage(0);
              }}
              className="text-sm border border-slate-200 rounded-lg p-2 outline-none bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 w-full sm:w-[220px]"
            />
          </div>
          {filterDate && (
            <button
              onClick={() => {
                setFilterDate('');
                setPage(0);
              }}
              className="w-full sm:w-auto text-xs text-rose-500 font-bold hover:text-rose-600 hover:bg-rose-50 px-4 py-2.5 rounded-lg transition-colors border border-rose-200 shadow-sm"
            >
              Clear Filter
            </button>
          )}
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : activeTab === 'schedule' && user?.role !== 'DOCTOR' ? (
        <AppointmentScheduler onSuccess={() => setActiveTab('upcoming')} />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          {/* Appointment list content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 font-semibold">Patient Name</th>
                  <th className="p-4 font-semibold">Assigned Doctor</th>
                  <th className="p-4 font-semibold">Scheduled Date</th>
                  <th className="p-4 font-semibold">Reason / Illness</th>
                  <th className="p-4 font-semibold">Status</th>
                  {/* Actions column shown for upcoming and missed tabs */}
                  {(activeTab === 'upcoming' || activeTab === 'missed') && <th className="p-4 font-semibold text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={(activeTab === 'upcoming' || activeTab === 'missed') ? 6 : 5} className="p-8 text-center text-slate-400">
                      No appointments registered on this date.
                    </td>
                  </tr>
                ) : (
                  appointments.map(a => (
                    <tr key={a.idAppointment} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-800">
                        {a.patient.user.firstName} {a.patient.user.lastName}
                      </td>
                      <td className="p-4">
                        Dr. {a.doctor.user.firstName} {a.doctor.user.lastName}
                      </td>
                      <td className="p-4">
                        {new Date(a.dateOfAppointment).toLocaleString('fr-FR')}
                      </td>
                      <td className="p-4 text-slate-500">
                        {a.typeOfIllness || 'Routine consult'}
                      </td>
                      <td className="p-4 text-xs font-bold">
                        {activeTab === 'missed' || a.status === 'NO_SHOW' ? (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">
                            missed
                          </span>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full ${a.status === 'SCHEDULED'
                              ? 'bg-sky-50 text-sky-600'
                              : a.status === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-rose-50 text-rose-600'
                            }`}>
                            {a.status?.toLowerCase()}
                          </span>
                        )}
                      </td>
                      {(activeTab === 'upcoming' || activeTab === 'missed') && (
                        <td className="p-4 text-center flex items-center justify-center gap-2">
                          {(user?.role === 'DOCTOR' || user?.role === 'ADMIN') && (
                            <button
                              onClick={() => {
                                setSelectedAppt(a);
                                setTypeofIllness(a.typeOfIllness || '');
                                setCompleteModalOpen(true);
                              }}
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Record Consultation"
                            >
                              <CheckSquare size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleCancel(a.idAppointment)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Cancel Appointment"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-semibold">Page {currentPage + 1} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setPage(currentPage - 1)}
                  className="bg-white border border-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors shadow-sm"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages - 1}
                  onClick={() => setPage(currentPage + 1)}
                  className="bg-white border border-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Complete & Record Consultation Modal */}
      {completeModalOpen && selectedAppt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden transform transition-all duration-300 scale-100">
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">Record Consultation</h3>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  Patient: {selectedAppt.patient.user.firstName} {selectedAppt.patient.user.lastName}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCompleteModalOpen(false)}
                className="text-slate-450 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCompleteSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Type of Illness</label>
                <input
                  type="text"
                  value={typeofIllness}
                  onChange={(e) => setTypeofIllness(e.target.value)}
                  required
                  placeholder="e.g. Hypertension, Flu, Follow-up"
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Diagnosis & Clinical Notes</label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                  rows={3}
                  placeholder="Record symptoms, clinical findings and diagnosis..."
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Prescription Section */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h4 className="text-xs font-extrabold text-sky-600 uppercase tracking-wider">Issue Prescription (Optional)</h4>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Medication Name</label>
                  <input
                    type="text"
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    placeholder="e.g. Amoxicillin 500mg, Paracetamol"
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Dosage</label>
                    <input
                      type="text"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      placeholder="1 tablet"
                      className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Frequency</label>
                    <input
                      type="text"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      placeholder="3x daily"
                      className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Days</label>
                    <input
                      type="number"
                      value={durationDays}
                      onChange={(e) => setDurationDays(parseInt(e.target.value) || 0)}
                      min={1}
                      className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCompleteModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 font-bold text-xs rounded-xl hover:bg-slate-50 hover:text-slate-700 transition-all shadow-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-emerald-600/30 transition-all"
                >
                  Save & Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
