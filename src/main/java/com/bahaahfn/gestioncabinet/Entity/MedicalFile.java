package com.bahaahfn.gestioncabinet.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "medical_files")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MedicalFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_medical_file")
    private Long idMedicalFile;
    
    @OneToOne
    @JoinColumn(name = "id_patient", nullable = false, unique = true)
    private Patient patient;
    
    @Builder.Default
    @Column(name = "total_consultations")
    private Integer totalConsultations = 0;
    
    @Column(name = "last_consultation_date")
    private LocalDateTime lastConsultationDate;
    
    @Column(name = "blood_type")
    private String bloodType;
    
    @Column(name = "chronic_diseases", columnDefinition = "TEXT")
    private String chronicDiseases;
    
    @Column(columnDefinition = "TEXT")
    private String surgeries;
    
    @Column(columnDefinition = "TEXT")
    private String vaccinations;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
