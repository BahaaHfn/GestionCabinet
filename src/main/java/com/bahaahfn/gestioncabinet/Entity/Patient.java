package com.bahaahfn.gestioncabinet.Entity;

import com.bahaahfn.gestioncabinet.Enum.Gender;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "patients")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_patient")
    private Long idPatient;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_user", nullable = false)
    private User user;
    
    @Column(name = "birth_date")
    private LocalDate birthDate;
    
    @Enumerated(EnumType.STRING)
    private Gender sex;
    
    @Column(name = "blood_type")
    private String bloodType;
    
    @Column(columnDefinition = "TEXT")
    private String allergies;
    
    @Column(name = "medical_conditions", columnDefinition = "TEXT")
    private String medicalConditions;
    
    @Column(name = "insurance_number")
    private String insuranceNumber;
    
    @Column(name = "emergency_contact")
    private String emergencyContact;
    
    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Appointment> appointments;
    
    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL)
    @JsonIgnore
    private MedicalFile medicalFile;
}
