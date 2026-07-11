package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Doctor;
import com.bahaahfn.gestioncabinet.Entity.User;
import com.bahaahfn.gestioncabinet.Enum.AccountType;
import com.bahaahfn.gestioncabinet.Repository.DoctorRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorServiceImpl(DoctorRepository doctorRepository, PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Doctor save(Doctor doctor) {
        if (doctor.getUser() != null) {
            User user = doctor.getUser();
            if (user.getPassword() != null) {
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }
            if (user.getAccountType() == null) {
                user.setAccountType(AccountType.DOCTOR);
            }
        }
        return doctorRepository.save(doctor);
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
    public Doctor update(Doctor doctor) {
        Doctor existing = doctorRepository.findById(doctor.getIdDoctor()).orElse(null);
        if (existing != null) {
            existing.setSpecialty(doctor.getSpecialty());
            existing.setLicenseNumber(doctor.getLicenseNumber());
            existing.setOfficePhone(doctor.getOfficePhone());
            existing.setOfficeAddress(doctor.getOfficeAddress());
            existing.setYearsOfExperience(doctor.getYearsOfExperience());
            existing.setIsAvailable(doctor.getIsAvailable());
            
            if (doctor.getUser() != null && existing.getUser() != null) {
                User existingUser = existing.getUser();
                User updatedUser = doctor.getUser();
                existingUser.setFirstName(updatedUser.getFirstName());
                existingUser.setLastName(updatedUser.getLastName());
                existingUser.setPhone(updatedUser.getPhone());
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setCin(updatedUser.getCin());
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }
            }
            return doctorRepository.save(existing);
        }
        return null;
    }

    @Override
    public List<Doctor> findAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public Page<Doctor> searchDoctors(String keyword, Pageable pageable) {
        return doctorRepository.findBySpecialtyContainingIgnoreCase(keyword, pageable);
    }

    @Override
    public long countDoctors() {
        return doctorRepository.count();
    }

    @Override
    public Doctor findByEmail(String email) {
        return doctorRepository.findByUser_Email(email).orElse(null);
    }
}
