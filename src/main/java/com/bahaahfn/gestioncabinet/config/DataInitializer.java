package com.bahaahfn.gestioncabinet.config;

import com.bahaahfn.gestioncabinet.Enum.AccountType;
import com.bahaahfn.gestioncabinet.Enum.AppointmentStatus;
import com.bahaahfn.gestioncabinet.Repository.AppointmentRepository;
import com.bahaahfn.gestioncabinet.Repository.DoctorRepository;
import com.bahaahfn.gestioncabinet.Repository.PatientRepository;
import com.bahaahfn.gestioncabinet.Repository.UserRepository;
import com.bahaahfn.gestioncabinet.Service.UserService;
import com.bahaahfn.gestioncabinet.dto.RegisterRequest;
import com.bahaahfn.gestioncabinet.Entity.Appointment;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, 
                                     UserService userService,
                                     PatientRepository patientRepository,
                                     DoctorRepository doctorRepository,
                                     AppointmentRepository appointmentRepository) {
        return args -> {
            // Seed Admin User
            if (userRepository.findByEmail("admin@cabinet.com").isEmpty()) {
                RegisterRequest adminReq = new RegisterRequest();
                adminReq.setEmail("admin@cabinet.com");
                adminReq.setPassword("admin123");
                adminReq.setFirstName("Admin");
                adminReq.setLastName("Système");
                adminReq.setPhone("0600000000");
                adminReq.setCin("CIN-ADMIN");
                adminReq.setAccountType(AccountType.ADMIN.name());
                userService.register(adminReq);
                System.out.println(">>> Utilisateur admin créé : admin@cabinet.com / admin123");
            }

            // Seed Doctor User
            if (userRepository.findByEmail("doctor@cabinet.com").isEmpty()) {
                RegisterRequest docReq = new RegisterRequest();
                docReq.setEmail("doctor@cabinet.com");
                docReq.setPassword("doctor123");
                docReq.setFirstName("Bahaa");
                docReq.setLastName("Doctor");
                docReq.setPhone("0611111111");
                docReq.setCin("CIN-DOCTOR");
                docReq.setAccountType(AccountType.DOCTOR.name());
                docReq.setSpecialty("Cardiology");
                docReq.setLicenseNumber("LIC-12345");
                docReq.setOfficePhone("0522001122");
                docReq.setOfficeAddress("123 Medical Avenue");
                docReq.setYearsOfExperience(10);
                userService.register(docReq);
                System.out.println(">>> Docteur créé : doctor@cabinet.com / doctor123");
            }
            
            // Seed Patient User
            if (userRepository.findByEmail("patient@cabinet.com").isEmpty()) {
                RegisterRequest patReq = new RegisterRequest();
                patReq.setEmail("patient@cabinet.com");
                patReq.setPassword("patient123");
                patReq.setFirstName("John");
                patReq.setLastName("Doe");
                patReq.setPhone("0622222222");
                patReq.setCin("CIN-PATIENT");
                patReq.setAccountType(AccountType.PATIENT.name());
                patReq.setBirthDate(LocalDate.of(1990, 5, 15));
                patReq.setSex("MALE");
                patReq.setBloodType("O+");
                patReq.setAllergies("Peanut allergy");
                patReq.setMedicalConditions("Mild Asthma");
                patReq.setInsuranceNumber("INS-778899");
                patReq.setEmergencyContact("Jane Doe - 0633333333");
                userService.register(patReq);
                System.out.println(">>> Patient créé : patient@cabinet.com / patient123");
            }

            // Clean up seeded fake doctors, patients, and appointments to keep db clean
            appointmentRepository.findAll().stream()
                .filter(a -> a.getDescription() != null && a.getDescription().contains("Automatic seed testing"))
                .forEach(a -> {
                    try {
                        appointmentRepository.delete(a);
                    } catch (Exception ignored) {}
                });
                
            for (int i = 1; i <= 15; i++) {
                String docEmail = "doctor" + i + "@cabinet.com";
                try {
                    doctorRepository.findByUser_Email(docEmail).ifPresent(d -> doctorRepository.delete(d));
                    userRepository.findByEmail(docEmail).ifPresent(u -> userRepository.delete(u));
                } catch (Exception ignored) {}
                
                String patEmail = "patient" + i + "@cabinet.com";
                try {
                    patientRepository.findByUser_Email(patEmail).ifPresent(p -> patientRepository.delete(p));
                    userRepository.findByEmail(patEmail).ifPresent(u -> userRepository.delete(u));
                } catch (Exception ignored) {}
            }
        };
    }
}
