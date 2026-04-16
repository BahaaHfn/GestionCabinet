package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PatientService {
    void save(Patient patient);
    Patient findPatientById(long id);
    void delete(long id);
    void update(Patient patient);
    List<Patient> findAllPatients();
    Page<Patient> searchPatients(String keyword, Pageable pageable);
    long countPatients();
}
