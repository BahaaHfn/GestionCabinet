package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Consultation;
import com.bahaahfn.gestioncabinet.Entity.Doctor;
import com.bahaahfn.gestioncabinet.Entity.Patient;
import com.bahaahfn.gestioncabinet.Entity.Prescription;
import com.bahaahfn.gestioncabinet.Repository.ConsultationRepository;
import com.bahaahfn.gestioncabinet.Repository.DoctorRepository;
import com.bahaahfn.gestioncabinet.Repository.PatientRepository;
import com.bahaahfn.gestioncabinet.Repository.PrescriptionRepository;
import com.bahaahfn.gestioncabinet.dto.CreatePrescriptionRequest;
import com.bahaahfn.gestioncabinet.dto.PrescriptionDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final ConsultationRepository consultationRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public PrescriptionServiceImpl(PrescriptionRepository prescriptionRepository,
                                   ConsultationRepository consultationRepository,
                                   PatientRepository patientRepository,
                                   DoctorRepository doctorRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.consultationRepository = consultationRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @Override
    public List<PrescriptionDTO> getActivePrescriptionsForPatient(Long patientId) {
        return prescriptionRepository.findByPatient_IdPatientAndIsActiveTrue(patientId)
            .stream()
            .map(PrescriptionDTO::new)
            .collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionDTO> getPrescriptionsByConsultation(Long consultationId) {
        return prescriptionRepository.findByConsultation_IdConsultation(consultationId)
            .stream()
            .map(PrescriptionDTO::new)
            .collect(Collectors.toList());
    }

    @Override
    public List<PrescriptionDTO> getPrescriptionsByDoctor(Long doctorId) {
        return prescriptionRepository.findByDoctor_IdDoctor(doctorId)
            .stream()
            .map(PrescriptionDTO::new)
            .collect(Collectors.toList());
    }

    @Override
    public PrescriptionDTO createPrescription(CreatePrescriptionRequest request) {
        Consultation consultation = consultationRepository.findById(request.getConsultationId())
            .orElseThrow(() -> new RuntimeException("Consultation not found"));
        
        Patient patient = patientRepository.findById(request.getPatientId())
            .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        Doctor doctor = request.getDoctorId() != null ? doctorRepository.findById(request.getDoctorId()).orElse(null) : null;

        Prescription prescription = Prescription.builder()
            .consultation(consultation)
            .patient(patient)
            .doctor(doctor)
            .medicationName(request.getMedicationName())
            .dosage(request.getDosage())
            .frequency(request.getFrequency())
            .durationDays(request.getDurationDays())
            .instructions(request.getInstructions())
            .isActive(true)
            .build();

        return new PrescriptionDTO(prescriptionRepository.save(prescription));
    }

    @Override
    public void deactivatePrescription(Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Prescription not found"));
        prescription.setIsActive(false);
        prescriptionRepository.save(prescription);
    }
}
