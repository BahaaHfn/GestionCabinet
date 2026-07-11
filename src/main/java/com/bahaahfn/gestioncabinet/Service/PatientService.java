package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PatientService {
    Patient save(Patient patient);
    Patient findPatientById(long id);
    void delete(long id);
    Patient update(Patient patient);
    List<Patient> findAllPatients();
    Page<Patient> searchPatients(String keyword, Pageable pageable);
    Page<Patient> findPatientsByDoctor(Long doctorId, String keyword, Pageable pageable);
    List<Patient> findPatientsByDoctorId(Long doctorId);
    long countPatients();
}
