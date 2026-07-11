package com.bahaahfn.gestioncabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateAppointmentRequest {
    private Long patientId;
    private Long doctorId;
    private LocalDateTime appointmentDate;
    private String typeofIllness;
    private String description;
}
