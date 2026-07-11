package com.bahaahfn.gestioncabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompleteAppointmentRequest {
    private String diagnosis;
    private String typeOfIllness;
    private String medicationName;
    private String dosage;
    private String frequency;
    private Integer durationDays;
}
