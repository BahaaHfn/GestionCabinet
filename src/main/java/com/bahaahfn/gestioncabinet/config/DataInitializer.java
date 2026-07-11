package com.bahaahfn.gestioncabinet.config;

import com.bahaahfn.gestioncabinet.Entity.Doctor;
import com.bahaahfn.gestioncabinet.Repository.DoctorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(DoctorRepository doctorRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (doctorRepository.findByEmail("admin@cabinet.com").isEmpty()) {
                Doctor admin = new Doctor();
                admin.setNom("Admin");
                admin.setPrenom("Système");
                admin.setEmail("admin@cabinet.com");
                admin.setTelephone("0600000000");
                admin.setSpecialite("Administration");
                admin.setMotDePasse(passwordEncoder.encode("admin123"));
                admin.setRole("ADMIN");
                doctorRepository.save(admin);
                System.out.println(">>> Docteur admin créé : admin@cabinet.com / admin123");
            }
        };
    }
}

