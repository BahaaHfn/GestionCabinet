package com.bahaahfn.gestioncabinet.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Table(name = "doctor_schedules")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DoctorSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_schedule")
    private Long idSchedule;
    
    @ManyToOne
    @JoinColumn(name = "id_doctor", nullable = false)
    private Doctor doctor;
    
    @Column(name = "day_of_week")
    private Integer dayOfWeek; // 0=Monday, 6=Sunday
    
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;
    
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
    
    @Builder.Default
    @Column(name = "slot_duration")
    private Integer slotDuration = 30; // minutes
}
