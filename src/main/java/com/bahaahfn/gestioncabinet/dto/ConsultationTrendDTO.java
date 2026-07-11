package com.bahaahfn.gestioncabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultationTrendDTO {
    private String month;
    private long consultations;
}
