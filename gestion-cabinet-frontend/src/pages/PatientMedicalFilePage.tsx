import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { Patient, MedicalFile, Consultation } from '../types';
import { MedicalFileView } from '../components/medical/MedicalFileView';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';

export const PatientMedicalFilePage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [medicalFile, setMedicalFile] = useState<MedicalFile | null>(null);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patientId) {
      fetchMedicalFile();
    }
  }, [patientId]);

  const fetchMedicalFile = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/patients/${patientId}`);
      setConsultations(res.data.consultations || []);
      
      if (res.data.patient.medicalFile) {
        setMedicalFile(res.data.patient.medicalFile);
      } else {
        setMedicalFile({
          idMedicalFile: 0,
          patient: res.data.patient,
          totalConsultations: res.data.consultations?.length || 0,
          bloodType: res.data.patient.bloodType || 'O+'
        } as any);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner />;

  if (!medicalFile) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-slate-500 font-semibold">
        Medical File record not found.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/"
        className="text-slate-500 hover:text-slate-800 text-sm font-semibold flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <MedicalFileView 
        medicalFile={medicalFile} 
        consultations={consultations} 
        onRefresh={fetchMedicalFile}
      />
    </div>
  );
};
