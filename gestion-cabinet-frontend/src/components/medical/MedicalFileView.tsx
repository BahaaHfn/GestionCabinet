import React, { useState } from 'react';
import { MedicalFile, Consultation } from '../../types';
import { useAuthStore } from '../../store/authStore';
import api from '../../api';
import { FileText, Calendar, ShieldAlert, Award, FileCode, CheckCircle, RefreshCw } from 'lucide-react';

interface MedicalFileViewProps {
  medicalFile: MedicalFile;
  consultations: Consultation[];
  onRefresh?: () => void;
}

export const MedicalFileView: React.FC<MedicalFileViewProps> = ({ medicalFile, consultations, onRefresh }) => {
  const { user } = useAuthStore();
  const [editing, setEditing] = useState(false);
  
  const [bloodType, setBloodType] = useState(medicalFile.bloodType || 'O+');
  const [chronicDiseases, setChronicDiseases] = useState(medicalFile.chronicDiseases || '');
  const [surgeries, setSurgeries] = useState(medicalFile.surgeries || '');
  const [vaccinations, setVaccinations] = useState(medicalFile.vaccinations || '');
  
  const [saving, setSaving] = useState(false);

  const handleSaveFile = async () => {
    setSaving(true);
    try {
      // Put to /api/patients/{patientId} or a subroute to update medical file.
      // We will update the medical file via a PUT request.
      const payload = {
        idMedicalFile: medicalFile.idMedicalFile,
        bloodType,
        chronicDiseases,
        surgeries,
        vaccinations
      };
      await api.put(`/patients/${medicalFile.patient.idPatient}`, {
        ...medicalFile.patient,
        bloodType,
        medicalConditions: chronicDiseases, // matches patient user mapping
      });

      // Update medical file fields directly
      await api.post(`/patients/${medicalFile.patient.idPatient}/medical-file`, payload);

      setEditing(false);
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
      setEditing(false);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Profile */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-sky-500" />
            Medical Record Dossier
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Patient: {medicalFile.patient.user.firstName} {medicalFile.patient.user.lastName} 
            {medicalFile.patient.user.cin ? ` | CIN: ${medicalFile.patient.user.cin}` : ''}
          </p>
        </div>
        
        {user && user.role !== 'PATIENT' && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Edit Medical Parameters
          </button>
        )}
      </div>

      {/* Grid details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Blood Group */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <ShieldAlert size={20} />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Blood Group</span>
            {editing ? (
              <select
                value={bloodType}
                onChange={e => setBloodType(e.target.value)}
                className="w-full text-sm rounded border border-slate-200 p-1"
              >
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            ) : (
              <h4 className="text-lg font-bold text-slate-800">{medicalFile.bloodType || 'N/A'}</h4>
            )}
          </div>
        </div>

        {/* Total Consultations */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-lg">
            <Award size={20} />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Total Consultations</span>
            <h4 className="text-lg font-bold text-slate-800">{consultations.length}</h4>
          </div>
        </div>

        {/* Last Consultation Date */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <Calendar size={20} />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Last Consultation</span>
            <h4 className="text-lg font-bold text-slate-800">
              {medicalFile.lastConsultationDate 
                ? new Date(medicalFile.lastConsultationDate).toLocaleDateString('fr-FR')
                : consultations.length > 0 
                  ? new Date(consultations[0].date).toLocaleDateString('fr-FR')
                  : 'No consultation history'}
            </h4>
          </div>
        </div>
      </div>

      {/* Chronic Illnesses, Surgeries, Vaccinations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chronic */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Chronic Conditions</span>
          {editing ? (
            <textarea
              value={chronicDiseases}
              onChange={e => setChronicDiseases(e.target.value)}
              rows={3}
              className="w-full text-sm border border-slate-200 rounded p-2 resize-none"
            />
          ) : (
            <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap">{medicalFile.chronicDiseases || 'None reported'}</p>
          )}
        </div>

        {/* Surgeries */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Surgical History</span>
          {editing ? (
            <textarea
              value={surgeries}
              onChange={e => setSurgeries(e.target.value)}
              rows={3}
              className="w-full text-sm border border-slate-200 rounded p-2 resize-none"
            />
          ) : (
            <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap">{medicalFile.surgeries || 'None reported'}</p>
          )}
        </div>

        {/* Vaccinations */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Vaccinations</span>
          {editing ? (
            <textarea
              value={vaccinations}
              onChange={e => setVaccinations(e.target.value)}
              rows={3}
              className="w-full text-sm border border-slate-200 rounded p-2 resize-none"
            />
          ) : (
            <p className="text-sm font-medium text-slate-700 whitespace-pre-wrap">{medicalFile.vaccinations || 'None reported'}</p>
          )}
        </div>
      </div>

      {editing && (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setEditing(false)}
            className="text-slate-500 text-sm font-semibold py-2 px-4 rounded-lg hover:bg-slate-50 border border-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveFile}
            disabled={saving}
            className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-sm"
          >
            {saving ? 'Saving...' : 'Save Parameters'}
          </button>
        </div>
      )}

      {/* Timeline Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <FileCode className="text-sky-500" />
          Consultation Timeline History
        </h3>
        
        {consultations.length === 0 ? (
          <div className="text-center py-8 text-slate-400 font-medium">
            No consultations registered yet.
          </div>
        ) : (
          <div className="relative border-l border-slate-100 pl-6 ml-2 space-y-8">
            {consultations.map((c) => (
              <div key={c.idConsultation} className="relative">
                {/* Bullet */}
                <div className="absolute -left-[31px] top-1 bg-sky-50 border-2 border-sky-500 h-4 w-4 rounded-full"></div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <Calendar size={12} />
                    {new Date(c.date).toLocaleString('fr-FR')}
                    {c.doctor && (
                      <span> | Dr. {c.doctor.user.firstName} {c.doctor.user.lastName}</span>
                    )}
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                    <div>
                      <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Diagnosis</h5>
                      <p className="text-sm font-semibold text-slate-800">{c.diagnosis || 'None entered'}</p>
                    </div>
                    {c.description && (
                      <div>
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Clinical Notes</h5>
                        <p className="text-sm text-slate-600 font-medium">{c.description}</p>
                      </div>
                    )}
                    {c.treatmentPlan && (
                      <div>
                        <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Treatment Plan</h5>
                        <p className="text-sm text-slate-600 font-medium">{c.treatmentPlan}</p>
                      </div>
                    )}
                    {c.prescriptions && c.prescriptions.length > 0 && (
                      <div className="mt-2 p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                          <CheckCircle size={12} className="text-emerald-500" />
                          Prescribed Medication List
                        </span>
                        <ul className="list-disc list-inside text-xs text-slate-600 font-medium space-y-1">
                          {c.prescriptions.map(p => (
                            <li key={p.idPrescription}>
                              <strong className="text-slate-700">{p.medicationName}</strong>: {p.dosage} | {p.frequency} ({p.durationDays} days)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
