package com.bahaahfn.gestioncabinet.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_prescription")
    private Long idPrescription;
    
    @ManyToOne
    @JoinColumn(name = "id_consultation", nullable = false)
    private Consultation consultation;
    
    @ManyToOne
    @JoinColumn(name = "id_patient", nullable = false)
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "id_doctor")
    private Doctor doctor;
    
    @Column(name = "medication_name", nullable = false, length = 100)
    private String medicationName;
    
    @Column(nullable = false, length = 100)
    private String dosage;
    
    @Column(nullable = false, length = 100)
    private String frequency;
    
    @Column(name = "duration_days")
    private Integer durationDays;
    
    @Column(columnDefinition = "TEXT")
    private String instructions;
    
    @CreationTimestamp
    @Column(name = "date_prescribed", updatable = false)
    private LocalDateTime datePrescribed;
    
    @Column(name = "date_dispensed")
    private LocalDateTime dateDispensed;
    
    @Builder.Default
    @Column(name = "is_active")
    private Boolean isActive = true;
}
