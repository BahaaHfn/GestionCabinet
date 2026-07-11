package com.bahaahfn.gestioncabinet.Entity;

import com.bahaahfn.gestioncabinet.Enum.AppointmentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_appointment")
    private Long idAppointment;
    
    @ManyToOne
    @JoinColumn(name = "id_patient", nullable = false)
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "id_doctor")
    private Doctor doctor;
    
    @Column(name = "date_of_appointment", nullable = false)
    private LocalDateTime dateOfAppointment;
    
    @Column(name = "date_of_checking")
    private LocalDateTime dateOfChecking;
    
    @Column(name = "type_of_illness", length = 100)
    private String typeOfIllness;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private AppointmentStatus status = AppointmentStatus.SCHEDULED;
    
    @Builder.Default
    private Boolean notification = false;
    
    @Column(name = "notification_sent_at")
    private LocalDateTime notificationSentAt;
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
