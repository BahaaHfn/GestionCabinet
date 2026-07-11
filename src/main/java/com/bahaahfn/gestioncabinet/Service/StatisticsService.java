package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.dto.ConsultationTrendDTO;
import com.bahaahfn.gestioncabinet.dto.DashboardStatsDTO;

import java.util.List;
import java.util.Map;

public interface StatisticsService {
    DashboardStatsDTO getDashboardStats();
    DashboardStatsDTO getDoctorDashboardStats(Long doctorId);
    List<ConsultationTrendDTO> getMonthlyTrends(int months);
    List<ConsultationTrendDTO> getDoctorMonthlyTrends(Long doctorId, int months);
    Map<String, Long> getSpecialityDistribution();
}
