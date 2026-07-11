package com.bahaahfn.gestioncabinet.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "consultations")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_consultation")
    private Long idConsultation;
    
    @ManyToOne
    @JoinColumn(name = "id_appointment", nullable = false)
    private Appointment appointment;
    
    @ManyToOne
    @JoinColumn(name = "id_patient", nullable = false)
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "id_doctor")
    private Doctor doctor;
    
    @Column(nullable = false)
    private LocalDateTime date;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String diagnosis;
    
    @Column(name = "treatment_plan", columnDefinition = "TEXT")
    private String treatmentPlan;
    
    @Column(name = "follow_up_date")
    private LocalDateTime followUpDate;
    
    @OneToMany(mappedBy = "consultation", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Prescription> prescriptions;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
