package com.bahaahfn.gestioncabinet.Repository;

import com.bahaahfn.gestioncabinet.Entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, Long> {
}
