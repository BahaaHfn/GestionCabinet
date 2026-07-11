import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../api';
import { DashboardStats, ConsultationTrend, Appointment } from '../types';
import { StatCard } from '../components/common/StatCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { 
  LineChart, Line, PieChart, Pie, Cell, Tooltip, Legend, XAxis, YAxis, CartesianGrid, ResponsiveContainer 
} from 'recharts';
import { 
  Users, Stethoscope, FileText, CalendarRange, Clock, AlertCircle, FilePlus, ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<ConsultationTrend[]>([]);
  const [upcoming, setUpcoming] = useState<Appointment[]>([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);
      try {
        if (user.role !== 'PATIENT') {
          // Admin / Doctor dashboard stats
          const statsRes = await api.get<DashboardStats>('/statistics/dashboard');
          const trendsRes = await api.get<ConsultationTrend[]>('/statistics/trends/monthly?months=6');
          const appointmentsRes = await api.get<any>('/appointments/upcoming?size=5');
          
          setStats(statsRes.data);
          setTrends(trendsRes.data);

          // Map incoming DTO content list to UI Appointments
          const mappedAppts = (appointmentsRes.data.content || []).map((dto: any) => ({
            idAppointment: dto.idAppointment,
            dateOfAppointment: dto.dateOfAppointment,
            typeOfIllness: dto.typeOfIllness,
            description: dto.description,
            status: dto.status,
            notification: dto.notification || false,
            patient: {
              idPatient: dto.patientId,
              user: {
                firstName: dto.patientFirstName,
                lastName: dto.patientLastName,
                email: ''
              }
            } as any,
            doctor: {
              idDoctor: dto.doctorId,
              user: {
                firstName: dto.doctorFirstName,
                lastName: dto.doctorLastName,
                email: ''
              }
            } as any
          }));
          setUpcoming(mappedAppts);
        } else {
          // Patient specific dashboard: load their appointments & prescriptions
          const appointmentsRes = await api.get<any[]>(`/appointments/patient/${user.targetId}`);
          const prescrRes = await api.get<any[]>(`/prescriptions/patient/${user.targetId}`);

          const mappedAppts = appointmentsRes.data.map(dto => ({
            idAppointment: dto.idAppointment,
            dateOfAppointment: dto.dateOfAppointment,
            typeOfIllness: dto.typeOfIllness,
            description: dto.description,
            status: dto.status,
            notification: dto.notification || false,
            patient: { idPatient: dto.patientId } as any,
            doctor: {
              idDoctor: dto.doctorId,
              user: {
                firstName: dto.doctorFirstName,
                lastName: dto.doctorLastName,
                email: ''
              }
            } as any
          }));

          const sorted = mappedAppts.sort((a, b) => new Date(b.dateOfAppointment).getTime() - new Date(a.dateOfAppointment).getTime());
          setUpcoming(sorted.slice(0, 5));
          setPatientPrescriptions(prescrRes.data);
        }
      } catch (e) {
        console.error('Error loading stats', e);
      }
      setLoading(false);
    };

    loadData();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  // Chart colors
  const COLORS = ['#0ea5e9', '#0284c7', '#0369a1', '#075985', '#38bdf8', '#7dd3fc'];

  // Render Admin Dashboard
  if (user && user.role === 'ADMIN') {
    const pieData = stats?.specialtyDistribution
      ? Object.entries(stats.specialtyDistribution).map(([name, value]) => ({ name, value }))
      : [];

    return (
      <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Control Panel</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Hello Admin, here is the system-wide overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard 
            title="Total Patients" 
            value={stats?.totalPatients || 0} 
            icon={<Users size={20} />} 
          />
          <StatCard 
            title="Total Doctors" 
            value={stats?.totalDoctors || 0} 
            icon={<Stethoscope size={20} />} 
          />
          <StatCard 
            title="Total Appointments" 
            value={stats?.totalAppointments || 0} 
            icon={<CalendarRange size={20} />} 
          />
          <StatCard 
            title="Total Consultations" 
            value={stats?.totalConsultations || 0} 
            icon={<FileText size={20} />} 
          />
          <StatCard 
            title="Consults This Month" 
            value={stats?.consultationsThisMonth || 0} 
            icon={<Clock size={20} />} 
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trends line chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-md font-bold text-slate-800 mb-6">Consultation Trends</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Line type="monotone" dataKey="consultations" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Specialty pie chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-md font-bold text-slate-800 mb-6">Consultations by Specialty</h3>
            <div className="h-[300px] flex flex-col sm:flex-row items-center justify-center gap-4">
              {pieData.length === 0 ? (
                <div className="text-slate-400 text-sm font-semibold">No data available</div>
              ) : (
                <>
                  <div className="w-[200px] h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col gap-1.5 text-xs text-slate-600 font-semibold">
                    {pieData.map((entry, idx) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                        <span>{entry.name}: {entry.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Upcoming appointments */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <Clock size={18} className="text-sky-500" />
              Upcoming Scheduled Appointments
            </h3>
            <Link to="/appointments" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-0.5">
              Manage All <ChevronRight size={14} />
            </Link>
          </div>
          
          {upcoming.length === 0 ? (
            <div className="text-center py-8 text-slate-400 font-medium">
              No upcoming appointments scheduled.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-3 font-semibold">Patient</th>
                    <th className="p-3 font-semibold">Doctor</th>
                    <th className="p-3 font-semibold">Date</th>
                    <th className="p-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                  {upcoming.map(a => (
                    <tr key={a.idAppointment} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-800">{a.patient.user.firstName} {a.patient.user.lastName}</td>
                      <td className="p-3">Dr. {a.doctor.user.firstName} {a.doctor.user.lastName}</td>
                      <td className="p-3">{new Date(a.dateOfAppointment).toLocaleString('fr-FR')}</td>
                      <td className="p-3 text-xs">
                        <span className={`px-2 py-0.5 rounded-full font-bold ${a.status === 'SCHEDULED' ? 'bg-sky-50 text-sky-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {a.status.toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Doctor Dashboard
  if (user && user.role === 'DOCTOR') {
    return (
      <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Clinical Dashboard</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Welcome back, Dr. {user.firstName} {user.lastName}. Here is your clinical overview for today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="My Treated Patients" 
            value={stats?.totalPatients || 0} 
            icon={<Users size={20} className="text-sky-500" />} 
          />
          <StatCard 
            title="My Scheduled Slots" 
            value={stats?.totalDoctors || 0} 
            icon={<CalendarRange size={20} className="text-sky-500" />} 
          />
          <StatCard 
            title="Completed Consultations" 
            value={stats?.totalConsultations || 0} 
            icon={<FileText size={20} className="text-sky-500" />} 
          />
          <StatCard 
            title="My Visits This Month" 
            value={stats?.consultationsThisMonth || 0} 
            icon={<Clock size={20} className="text-sky-500" />} 
          />
        </div>

        {/* Charts & Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trends line chart */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm lg:col-span-2">
            <h3 className="text-md font-bold text-slate-800 mb-6">My Consultation Trends</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                  <Line type="monotone" dataKey="consultations" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick clinical actions */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-md font-bold text-slate-800 flex items-center gap-1.5">
                <Stethoscope size={18} className="text-sky-500" />
                Quick Clinical Tools
              </h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                Review your schedule, record consultations, issue prescriptions, or inspect medical files of your patients.
              </p>
              <div className="space-y-2 pt-2">
                <Link to="/appointments" className="flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-lg transition-colors border border-slate-100">
                  <span>Manage Appointments</span>
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>
                <Link to="/patients" className="flex items-center justify-between text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 p-2.5 rounded-lg transition-colors border border-slate-100">
                  <span>Patients List & Diagnostics</span>
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold border-t border-slate-100 pt-4 mt-4">
              Medical Practitioner Licence Office. Emergency backup server active.
            </div>
          </div>
        </div>

        {/* Doctor's appointments agenda preview */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-2">
              <Clock size={18} className="text-sky-500" />
              My Upcoming Consultations Agenda
            </h3>
            <Link to="/appointments" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-0.5">
              Review Full Calendar <ChevronRight size={14} />
            </Link>
          </div>
          
          {upcoming.length === 0 ? (
            <div className="text-center py-8 text-slate-400 font-medium">
              No consultations scheduled.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-3 font-semibold">Patient Name</th>
                    <th className="p-3 font-semibold">Date & Time</th>
                    <th className="p-3 font-semibold">Reason</th>
                    <th className="p-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                  {upcoming.map(a => (
                    <tr key={a.idAppointment} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-800">{a.patient.user.firstName} {a.patient.user.lastName}</td>
                      <td className="p-3">{new Date(a.dateOfAppointment).toLocaleString('fr-FR')}</td>
                      <td className="p-3 text-slate-500">{a.typeOfIllness || 'Checkup'}</td>
                      <td className="p-3 text-center text-xs">
                        <span className={`px-2.5 py-1 rounded-full font-bold ${a.status === 'SCHEDULED' ? 'bg-sky-50 text-sky-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {a.status.toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render Patient Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Patient Care Portal</h1>
        <p className="text-slate-500 font-medium text-sm mt-1">Hello {user?.firstName}, manage your bookings and prescriptions here.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Booking card links */}
        <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl p-6 text-white shadow-lg shadow-sky-100 flex flex-col justify-between h-[200px]">
          <div className="space-y-2">
            <h3 className="text-lg font-bold">Book a Consultation</h3>
            <p className="text-sky-100 text-xs font-semibold leading-relaxed">Select a doctor, pick a calendar day, and secure your time slot instantly.</p>
          </div>
          <Link
            to="/appointments"
            className="bg-white text-sky-600 text-xs font-bold py-2.5 px-4 rounded-lg shadow-md hover:bg-sky-50 transition-all text-center self-start"
          >
            Schedule Now
          </Link>
        </div>

        {/* Medical record card link */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-[200px]">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <FileText className="text-sky-500" />
              My Medical File
            </h3>
            <p className="text-slate-500 text-xs font-semibold leading-relaxed">Browse clinical history summaries, doctor diagnoses, and surgical records.</p>
          </div>
          <Link
            to={`/medical-file/${user?.targetId}`}
            className="border border-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-lg hover:bg-slate-50 transition-colors text-center self-start"
          >
            Access Record
          </Link>
        </div>

        {/* Notifications or alerts card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-[200px]">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <AlertCircle className="text-amber-500" />
              Support Information
            </h3>
            <p className="text-slate-500 text-xs font-semibold leading-relaxed">Need urgent assistance? Emergency contact lines are open 24/7. Call office: 05 22 00 11 22.</p>
          </div>
          <a
            href="tel:0522001122"
            className="bg-slate-100 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-lg hover:bg-slate-200 transition-colors text-center self-start"
          >
            Call Office
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointments List */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-md font-bold text-slate-800">My Appointments</h3>
          
          {upcoming.length === 0 ? (
            <div className="text-center py-8 text-slate-400 font-medium">
              No appointments scheduled.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {upcoming.map(a => (
                <div key={a.idAppointment} className="py-3 flex justify-between items-center text-sm font-semibold">
                  <div>
                    <h5 className="text-slate-800">Dr. {a.doctor.user.firstName} {a.doctor.user.lastName}</h5>
                    <span className="text-slate-400 text-xs font-medium">{a.typeOfIllness || 'General Consultation'}</span>
                  </div>
                  <span className="text-slate-500 text-xs font-semibold bg-slate-100 py-1 px-2.5 rounded-full">
                    {new Date(a.dateOfAppointment).toLocaleString('fr-FR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Prescriptions list */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-md font-bold text-slate-800">Active Prescriptions</h3>
          
          {patientPrescriptions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 font-medium">
              No active prescriptions.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {patientPrescriptions.map(p => (
                <div key={p.idPrescription} className="py-3 flex justify-between items-center text-sm font-semibold">
                  <div>
                    <h5 className="text-slate-800">{p.medicationName}</h5>
                    <span className="text-slate-400 text-xs font-medium">{p.dosage} | {p.frequency}</span>
                  </div>
                  <span className="text-emerald-600 bg-emerald-50 text-xs py-1 px-2.5 rounded-full font-bold">
                    {p.durationDays} Days
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
