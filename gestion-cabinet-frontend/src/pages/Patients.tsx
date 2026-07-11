import React, { useEffect, useState } from 'react';
import api from '../api';
import { Patient, Consultation, MedicalFile } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { MedicalFileView } from '../components/medical/MedicalFileView';
import { Search, UserPlus, Trash2, Eye, X, PlusCircle, ArrowLeft } from 'lucide-react';

export const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);

  // Selected patient details
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [patientDetails, setPatientDetails] = useState<Patient | null>(null);
  const [medicalFile, setMedicalFile] = useState<MedicalFile | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  
  // Creation state
  const [showCreate, setShowCreate] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [cin, setCin] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState('MALE');
  const [bloodType, setBloodType] = useState('O+');

  // Consultation creation state inside patient detail
  const [showAddConsult, setShowAddConsult] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [consultDescription, setConsultDescription] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  
  // Prescriptions list inside new consultation
  const [prescriptions, setPrescriptions] = useState<Array<{
    medicationName: string;
    dosage: string;
    frequency: string;
    durationDays: number;
    instructions: string;
  }>>([]);

  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFreq, setMedFreq] = useState('');
  const [medDuration, setMedDuration] = useState(7);
  const [medInst, setMedInst] = useState('');

  useEffect(() => {
    fetchPatients();
  }, [currentPage, keyword]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/patients?keyword=${keyword}&page=${currentPage}&size=10`);
      setPatients(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const loadPatientDetail = async (id: number) => {
    try {
      const res = await api.get(`/patients/${id}`);
      setPatientDetails(res.data.patient);
      setConsultations(res.data.consultations || []);
      
      // Look up medical file
      // Since it's linked to the patient, it is returned in patient details, or we query it.
      // We will look for medicalFile inside patient or pull from patient details.
      if (res.data.patient.medicalFile) {
        setMedicalFile(res.data.patient.medicalFile);
      } else {
        // If not found directly, let's create a stub so the component renders correctly
        setMedicalFile({
          idMedicalFile: 0,
          patient: res.data.patient,
          totalConsultations: res.data.consultations?.length || 0,
          bloodType: res.data.patient.bloodType || 'O+'
        } as any);
      }
      setSelectedPatientId(id);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', {
        email,
        password,
        firstName,
        lastName,
        phone,
        cin,
        accountType: 'PATIENT',
        birthDate,
        sex,
        bloodType
      });
      setShowCreate(false);
      
      // Clear inputs
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setCin('');
      setBirthDate('');
      
      fetchPatients();
    } catch (err) {
      alert('Error registering patient.');
    }
  };

  const handleDeletePatient = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this patient profile?')) return;
    try {
      await api.delete(`/patients/${id}`);
      fetchPatients();
      if (selectedPatientId === id) setSelectedPatientId(null);
    } catch (e) {
      alert('Failed to delete patient.');
    }
  };

  const handleAddPrescriptionItem = () => {
    if (!medName || !medDosage || !medFreq) return;
    setPrescriptions([...prescriptions, {
      medicationName: medName,
      dosage: medDosage,
      frequency: medFreq,
      durationDays: medDuration,
      instructions: medInst
    }]);
    setMedName('');
    setMedDosage('');
    setMedFreq('');
    setMedInst('');
  };

  const handleCreateConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientDetails) return;

    try {
      // 1. Create the consultation
      // Fetch default active doctor or first doctor ID from token context or admin
      const token = localStorage.getItem('user');
      const currentUser = token ? JSON.parse(token) : null;
      
      // Let's create an appointment stub first or associate it directly.
      // For standalone consultations, we can mock a completed appointment or pass null.
      // In the DB, consultations requires an appointment ID.
      // So we will fetch the patient's active scheduled appointments or create a dummy appointment.
      // Let's look up patient's scheduled appointments
      const apptsRes = await api.get<any[]>(`/appointments/patient/${patientDetails.idPatient}`);
      let appointmentId = null;
      
      const activeAppt = apptsRes.data.find(a => a.status === 'SCHEDULED');
      if (activeAppt) {
        appointmentId = activeAppt.idAppointment;
        // update appointment status to COMPLETED
        await api.put(`/appointments/${appointmentId}`, {
          ...activeAppt,
          status: 'COMPLETED'
        });
      } else {
        // Create dummy appointment to avoid foreign key violation
        const dummyApptRes = await api.post('/appointments', {
          patientId: patientDetails.idPatient,
          doctorId: currentUser?.targetId || 1,
          appointmentDate: new Date().toISOString(),
          typeofIllness: 'Routine Consultation',
          description: 'Consultation Visit'
        });
        appointmentId = dummyApptRes.data.idAppointment;
        // update status to COMPLETED
        await api.put(`/appointments/${appointmentId}`, {
          patientId: patientDetails.idPatient,
          doctorId: currentUser?.targetId || 1,
          appointmentDate: new Date().toISOString(),
          typeofIllness: 'Routine Consultation',
          status: 'COMPLETED'
        });
      }

      const consultRes = await api.post('/consultations', {
        appointment: { idAppointment: appointmentId },
        patient: { idPatient: patientDetails.idPatient },
        doctor: { idDoctor: currentUser?.targetId || 1 },
        date: new Date().toISOString(),
        description: consultDescription,
        diagnosis,
        treatmentPlan,
        followUpDate: followUpDate ? new Date(followUpDate).toISOString() : null
      });

      const consultationId = consultRes.data.idConsultation;

      // 2. Create the prescription items
      for (const p of prescriptions) {
        await api.post('/prescriptions', {
          consultationId,
          patientId: patientDetails.idPatient,
          doctorId: currentUser?.targetId || 1,
          medicationName: p.medicationName,
          dosage: p.dosage,
          frequency: p.frequency,
          durationDays: p.durationDays,
          instructions: p.instructions
        });
      }

      // Reset
      setShowAddConsult(false);
      setDiagnosis('');
      setConsultDescription('');
      setTreatmentPlan('');
      setFollowUpDate('');
      setPrescriptions([]);

      // Reload
      loadPatientDetail(patientDetails.idPatient);
    } catch (err: any) {
      console.error(err);
      alert('Error registering consultation: ' + err.message);
    }
  };

  if (selectedPatientId && patientDetails && medicalFile) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <button
          onClick={() => setSelectedPatientId(null)}
          className="text-slate-500 hover:text-slate-800 text-sm font-semibold flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Patients list
        </button>

        {/* Add Consultation Modal trigger */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-slate-900">Patient Detail File</h1>
          {!showAddConsult && (
            <button
              onClick={() => setShowAddConsult(true)}
              className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              <PlusCircle size={16} /> New Visit Consultation
            </button>
          )}
        </div>

        {/* Form add consultation */}
        {showAddConsult && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-inner space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Record Consultation & Treatment</h3>
              <button onClick={() => setShowAddConsult(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateConsultation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Diagnosis / Illness</label>
                  <input
                    type="text"
                    required
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Bronchitis"
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Follow Up Date (Optional)</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={e => setFollowUpDate(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Clinical Symptoms / Observations</label>
                <textarea
                  value={consultDescription}
                  onChange={e => setConsultDescription(e.target.value)}
                  rows={2}
                  placeholder="Patient reports chest pain..."
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Treatment Plan</label>
                <textarea
                  value={treatmentPlan}
                  onChange={e => setTreatmentPlan(e.target.value)}
                  rows={2}
                  placeholder="Prescribed rest and antibiotic course..."
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500 resize-none"
                />
              </div>

              {/* Prescriptions item list */}
              <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-4">
                <h4 className="font-bold text-slate-700 text-sm">Issue Prescribed Medication</h4>
                
                {prescriptions.length > 0 && (
                  <ul className="divide-y divide-slate-100 text-xs font-semibold text-slate-600">
                    {prescriptions.map((p, idx) => (
                      <li key={idx} className="py-2 flex justify-between">
                        <span>{p.medicationName} ({p.dosage}) - {p.frequency} | {p.durationDays} days</span>
                        <button
                          type="button"
                          onClick={() => setPrescriptions(prescriptions.filter((_, i) => i !== idx))}
                          className="text-rose-500 hover:text-rose-700"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Medication Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Amoxicillin"
                      value={medName}
                      onChange={e => setMedName(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded p-2 outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Dosage</label>
                    <input
                      type="text"
                      placeholder="e.g. 500mg"
                      value={medDosage}
                      onChange={e => setMedDosage(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded p-2 outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Frequency</label>
                    <input
                      type="text"
                      placeholder="e.g. 2x/day"
                      value={medFreq}
                      onChange={e => setMedFreq(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded p-2 outline-none focus:border-sky-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Duration (days)</label>
                    <input
                      type="number"
                      value={medDuration}
                      onChange={e => setMedDuration(Number(e.target.value))}
                      className="w-full text-xs border border-slate-200 rounded p-2 outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Special Instructions</label>
                  <input
                    type="text"
                    placeholder="Take after meals..."
                    value={medInst}
                    onChange={e => setMedInst(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded p-2 outline-none focus:border-sky-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddPrescriptionItem}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2 px-4 rounded transition-colors"
                >
                  + Add Medication
                </button>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddConsult(false)}
                  className="text-slate-500 text-sm font-semibold py-2.5 px-4 rounded-lg hover:bg-slate-100 border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg shadow-sm"
                >
                  Save Consultation File
                </button>
              </div>
            </form>
          </div>
        )}

        <MedicalFileView 
          medicalFile={medicalFile} 
          consultations={consultations} 
          onRefresh={() => loadPatientDetail(patientDetails.idPatient)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header bar */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Patient Directory</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Manage and look up clinical patient profiles.</p>
        </div>
        
        <button
          onClick={() => setShowCreate(true)}
          className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-sky-100 transition-all flex items-center gap-1.5"
        >
          <UserPlus size={16} /> Add Patient
        </button>
      </div>

      {/* Search and filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-2">
        <Search size={18} className="text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Search by first name or last name..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setCurrentPage(0);
          }}
          className="w-full text-sm outline-none border-none bg-transparent py-1 pr-4 font-medium text-slate-800 placeholder-slate-400"
        />
      </div>

      {/* Patient Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 max-w-lg w-full rounded-2xl p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowCreate(false)}
              className="absolute right-6 top-6 text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <UserPlus size={20} className="text-sky-500" />
              Register Patient Profile
            </h3>

            <form onSubmit={handleCreatePatient} className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">CIN / ID</label>
                <input
                  type="text"
                  required
                  value={cin}
                  onChange={e => setCin(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Date of Birth</label>
                <input
                  type="date"
                  required
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Sex</label>
                  <select
                    value={sex}
                    onChange={e => setSex(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none bg-white focus:border-sky-500"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Blood Group</label>
                  <select
                    value={bloodType}
                    onChange={e => setBloodType(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none bg-white focus:border-sky-500"
                  >
                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Account Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="text-slate-500 text-sm font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">CIN</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Gender</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No patients found matching the search.
                  </td>
                </tr>
              ) : (
                patients.map((p) => (
                  <tr key={p.idPatient} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">
                      {p.user.firstName} {p.user.lastName}
                    </td>
                    <td className="p-4">{p.user.cin || 'N/A'}</td>
                    <td className="p-4">{p.user.phone || 'N/A'}</td>
                    <td className="p-4 text-slate-500">{p.user.email}</td>
                    <td className="p-4 text-xs font-bold">
                      <span className={`px-2.5 py-1 rounded-full ${
                        p.sex === 'MALE' ? 'bg-sky-50 text-sky-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {p.sex?.toLowerCase()}
                      </span>
                    </td>
                    <td className="p-4 text-center flex items-center justify-center gap-2">
                      <button
                        onClick={() => loadPatientDetail(p.idPatient)}
                        className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        title="View Medical Dossier"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDeletePatient(p.idPatient)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Profile"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 bg-slate-50 border-t border-slate-100">
              <span className="text-xs text-slate-400 font-semibold">Page {currentPage + 1} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="bg-white border border-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages - 1}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="bg-white border border-slate-200 text-xs font-semibold py-1.5 px-3 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
