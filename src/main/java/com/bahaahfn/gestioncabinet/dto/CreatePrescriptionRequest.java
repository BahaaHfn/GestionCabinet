package com.bahaahfn.gestioncabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreatePrescriptionRequest {
    private Long consultationId;
    private Long patientId;
    private Long doctorId;
    private String medicationName;
    private String dosage;
    private String frequency;
    private Integer durationDays;
    private String instructions;
}
