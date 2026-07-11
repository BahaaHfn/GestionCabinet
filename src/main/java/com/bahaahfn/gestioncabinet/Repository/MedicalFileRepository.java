package com.bahaahfn.gestioncabinet.Repository;

import com.bahaahfn.gestioncabinet.Entity.MedicalFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedicalFileRepository extends JpaRepository<MedicalFile, Long> {
    Optional<MedicalFile> findByPatient_IdPatient(Long patientId);
}
