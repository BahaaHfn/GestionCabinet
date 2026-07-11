package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.dto.CreatePrescriptionRequest;
import com.bahaahfn.gestioncabinet.dto.PrescriptionDTO;

import java.util.List;

public interface PrescriptionService {
    List<PrescriptionDTO> getActivePrescriptionsForPatient(Long patientId);
    List<PrescriptionDTO> getPrescriptionsByConsultation(Long consultationId);
    List<PrescriptionDTO> getPrescriptionsByDoctor(Long doctorId);
    PrescriptionDTO createPrescription(CreatePrescriptionRequest request);
    void deactivatePrescription(Long id);
}
