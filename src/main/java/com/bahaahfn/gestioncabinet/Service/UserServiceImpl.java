package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Doctor;
import com.bahaahfn.gestioncabinet.Entity.MedicalFile;
import com.bahaahfn.gestioncabinet.Entity.Patient;
import com.bahaahfn.gestioncabinet.Entity.User;
import com.bahaahfn.gestioncabinet.Enum.AccountType;
import com.bahaahfn.gestioncabinet.Enum.Gender;
import com.bahaahfn.gestioncabinet.Repository.DoctorRepository;
import com.bahaahfn.gestioncabinet.Repository.MedicalFileRepository;
import com.bahaahfn.gestioncabinet.Repository.PatientRepository;
import com.bahaahfn.gestioncabinet.Repository.UserRepository;
import com.bahaahfn.gestioncabinet.dto.RegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final MedicalFileRepository medicalFileRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           PatientRepository patientRepository,
                           DoctorRepository doctorRepository,
                           MedicalFileRepository medicalFileRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.medicalFileRepository = medicalFileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already in use");
        }
        if (request.getCin() != null && userRepository.findByCin(request.getCin()).isPresent()) {
            throw new IllegalArgumentException("CIN is already in use");
        }

        AccountType role = AccountType.PATIENT;
        if (request.getAccountType() != null) {
            try {
                role = AccountType.valueOf(request.getAccountType().toUpperCase());
            } catch (IllegalArgumentException e) {
                // fall back to PATIENT
            }
        }

        User user = User.builder()
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .phone(request.getPhone())
            .cin(request.getCin())
            .accountType(role)
            .build();

        user = userRepository.save(user);

        if (role == AccountType.PATIENT) {
            Gender gender = Gender.OTHER;
            if (request.getSex() != null) {
                try {
                    gender = Gender.valueOf(request.getSex().toUpperCase());
                } catch (IllegalArgumentException e) {
                    // fall back to OTHER
                }
            }

            Patient patient = Patient.builder()
                .user(user)
                .birthDate(request.getBirthDate())
                .sex(gender)
                .bloodType(request.getBloodType())
                .allergies(request.getAllergies())
                .medicalConditions(request.getMedicalConditions())
                .insuranceNumber(request.getInsuranceNumber())
                .emergencyContact(request.getEmergencyContact())
                .build();
            patient = patientRepository.save(patient);

            // Automatically build medical file
            MedicalFile medicalFile = MedicalFile.builder()
                .patient(patient)
                .totalConsultations(0)
                .bloodType(patient.getBloodType())
                .chronicDiseases("")
                .surgeries("")
                .vaccinations("")
                .build();
            medicalFileRepository.save(medicalFile);

        } else if (role == AccountType.DOCTOR) {
            Doctor doctor = Doctor.builder()
                .user(user)
                .specialty(request.getSpecialty() != null ? request.getSpecialty() : "General Medicine")
                .licenseNumber(request.getLicenseNumber() != null ? request.getLicenseNumber() : "LIC-" + System.currentTimeMillis())
                .officePhone(request.getOfficePhone())
                .officeAddress(request.getOfficeAddress())
                .yearsOfExperience(request.getYearsOfExperience() != null ? request.getYearsOfExperience() : 0)
                .isAvailable(true)
                .build();
            doctorRepository.save(doctor);
        }

        return user;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public Optional<User> findByCin(String cin) {
        return userRepository.findByCin(cin);
    }
}
