package com.bahaahfn.gestioncabinet.Entity;
import com.bahaahfn.gestioncabinet.Enum.Sexe;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data @AllArgsConstructor @NoArgsConstructor
@Entity
public class Patient {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(length = 30)
    private String nom;
    @Column(length = 30)
    private String prenom;
    @Column(unique = true, length = 100)
    private String email;
    @Column(unique = true, length = 20)
    private String telephone;
    @Column(length = 150)
    private String adresse;
    private LocalDate dateNaissance;
    @Enumerated(EnumType.STRING)
    private Sexe sexe;
    @OneToMany(mappedBy = "patient")
    private List<Consultation> consultation;
}
