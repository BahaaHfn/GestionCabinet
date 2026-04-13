package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Patient;

import java.util.List;

public interface PatientService {
    void save(Patient patient);
    Patient findPatientById(long id);
    void delete(long id);
    void update(Patient patient);
    List<Patient> findAllPatients();
}
