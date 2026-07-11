package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Doctor;
import com.bahaahfn.gestioncabinet.Repository.DoctorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorServiceImpl(DoctorRepository doctorRepository, PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void save(Doctor doctor) {
        doctor.setMotDePasse(passwordEncoder.encode(doctor.getMotDePasse()));
        if (doctor.getRole() == null || doctor.getRole().isEmpty()) {
            doctor.setRole("DOCTOR");
        }
        doctorRepository.save(doctor);
    }

    @Override
    public Doctor findDoctorById(long id) {
        return doctorRepository.findById(id).orElse(null);
    }

    @Override
    public void delete(long id) {
        doctorRepository.deleteById(id);
    }

    @Override
    public void update(Doctor doctor) {
        Doctor existing = doctorRepository.findById(doctor.getId()).orElse(null);
        if (existing != null) {
            existing.setNom(doctor.getNom());
            existing.setPrenom(doctor.getPrenom());
            existing.setEmail(doctor.getEmail());
            existing.setTelephone(doctor.getTelephone());
            existing.setSpecialite(doctor.getSpecialite());
            existing.setRole(doctor.getRole());
            // Only update password if a new one is provided
            if (doctor.getMotDePasse() != null && !doctor.getMotDePasse().isEmpty()) {
                existing.setMotDePasse(passwordEncoder.encode(doctor.getMotDePasse()));
            }
            doctorRepository.save(existing);
        }
    }

    @Override
    public List<Doctor> findAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public Page<Doctor> searchDoctors(String keyword, Pageable pageable) {
        return doctorRepository.findByNomContainingIgnoreCaseOrPrenomContainingIgnoreCase(keyword, keyword, pageable);
    }

    @Override
    public long countDoctors() {
        return doctorRepository.count();
    }

    @Override
    public Doctor findByEmail(String email) {
        return doctorRepository.findByEmail(email).orElse(null);
    }
}

