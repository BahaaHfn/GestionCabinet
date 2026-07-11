package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Patient;
import com.bahaahfn.gestioncabinet.Entity.User;
import com.bahaahfn.gestioncabinet.Enum.AccountType;
import com.bahaahfn.gestioncabinet.Repository.PatientRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    public PatientServiceImpl(PatientRepository patientRepository, PasswordEncoder passwordEncoder) {
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Patient save(Patient patient) {
        if (patient.getUser() != null) {
            User user = patient.getUser();
            if (user.getPassword() != null) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            if (user.getAccountType() == null) {
                user.setAccountType(AccountType.PATIENT);
            }
        }
        return patientRepository.save(patient);
    }

    @Override
    public Patient findPatientById(long id) {
        return patientRepository.findById(id).orElse(null);
    }

    @Override
    public void delete(long id) {
        patientRepository.deleteById(id);
    }

    @Override
    public Patient update(Patient patient) {
        Patient existing = patientRepository.findById(patient.getIdPatient()).orElse(null);
        if (existing != null) {
            existing.setBirthDate(patient.getBirthDate());
            existing.setSex(patient.getSex());
            existing.setBloodType(patient.getBloodType());
            existing.setAllergies(patient.getAllergies());
            existing.setMedicalConditions(patient.getMedicalConditions());
            existing.setInsuranceNumber(patient.getInsuranceNumber());
            existing.setEmergencyContact(patient.getEmergencyContact());
            
            if (patient.getUser() != null && existing.getUser() != null) {
                User existingUser = existing.getUser();
                User updatedUser = patient.getUser();
                existingUser.setFirstName(updatedUser.getFirstName());
                existingUser.setLastName(updatedUser.getLastName());
                existingUser.setPhone(updatedUser.getPhone());
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setCin(updatedUser.getCin());
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }
            }
            return patientRepository.save(existing);
        }
        return null;
    }

    @Override
    public List<Patient> findAllPatients() {
        return patientRepository.findAll();
    }

    @Override
    public Page<Patient> searchPatients(String keyword, Pageable pageable) {
        return patientRepository.findByUser_FirstNameContainingIgnoreCaseOrUser_LastNameContainingIgnoreCase(keyword, keyword, pageable);
    }

    @Override
    public Page<Patient> findPatientsByDoctor(Long doctorId, String keyword, Pageable pageable) {
        return patientRepository.findPatientsByDoctor(doctorId, keyword, pageable);
    }

    @Override
    public List<Patient> findPatientsByDoctorId(Long doctorId) {
        return patientRepository.findPatientsByDoctorId(doctorId);
    }

    @Override
    public long countPatients() {
        return patientRepository.count();
    }
}
