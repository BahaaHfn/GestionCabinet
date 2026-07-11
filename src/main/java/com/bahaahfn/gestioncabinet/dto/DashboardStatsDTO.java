package com.bahaahfn.gestioncabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsDTO {
    private long totalPatients;
    private long totalDoctors;
    private long totalAppointments;
    private long totalConsultations;
    private long consultationsThisMonth;
    private Map<String, Long> specialtyDistribution;
}
