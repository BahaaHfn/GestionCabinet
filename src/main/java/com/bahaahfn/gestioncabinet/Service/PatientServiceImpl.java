package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Patient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientServiceImpl implements PatientService {
    @Override
    public void save(Patient patient) {

    }

    @Override
    public Patient findPatientById(long id) {
        return null;
    }

    @Override
    public void delete(long id) {

    }

    @Override
    public void update(Patient patient) {

    }

    @Override
    public List<Patient> findAllPatients() {
        return List.of();
    }
}
