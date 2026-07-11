package com.bahaahfn.gestioncabinet.Repository;

import com.bahaahfn.gestioncabinet.Entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByPatient_IdPatient(Long patientId);

    List<Consultation> findByDoctor_IdDoctor(Long doctorId);

    List<Consultation> findByDoctor_IdDoctorAndDateBetween(Long doctorId, LocalDateTime start, LocalDateTime end);

    long countByDoctor_IdDoctor(Long doctorId);

    List<Consultation> findByDateBetween(LocalDateTime start, LocalDateTime end);

    List<Consultation> findTop5ByOrderByDateDesc();
}
