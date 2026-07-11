package com.bahaahfn.gestioncabinet.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity @Data @AllArgsConstructor @NoArgsConstructor
public class Doctor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(length = 30)
    private String nom;
    @Column(length = 30)
    private String prenom;
    @Column(unique = true, length = 100)
    private String email;
    @Column(length = 20)
    private String telephone;
    @Column(length = 100)
    private String specialite;
    private String motDePasse;
    @Column(length = 20)
    private String role; // ADMIN or DOCTOR
    @OneToMany(mappedBy = "doctor")
    private List<Consultation> consultations;
}

