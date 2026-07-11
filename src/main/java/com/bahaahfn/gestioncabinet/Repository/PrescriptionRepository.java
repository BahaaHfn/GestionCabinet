package com.bahaahfn.gestioncabinet.Repository;

import com.bahaahfn.gestioncabinet.Entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatient_IdPatientAndIsActiveTrue(Long patientId);
    List<Prescription> findByConsultation_IdConsultation(Long consultationId);
    List<Prescription> findByDoctor_IdDoctor(Long doctorId);
}
