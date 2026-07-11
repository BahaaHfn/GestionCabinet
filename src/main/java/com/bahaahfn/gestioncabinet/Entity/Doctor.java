package com.bahaahfn.gestioncabinet.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "doctors")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_doctor")
    private Long idDoctor;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_user", nullable = false)
    private User user;
    
    @Column(nullable = false, length = 100)
    private String specialty;
    
    @Column(name = "license_number", unique = true, length = 50, nullable = false)
    private String licenseNumber;
    
    @Column(name = "office_phone")
    private String officePhone;
    
    @Column(name = "office_address")
    private String officeAddress;
    
    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;
    
    @Builder.Default
    @Column(name = "is_available")
    private Boolean isAvailable = true;
    
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Appointment> appointments;
    
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<DoctorSchedule> schedules;
}
