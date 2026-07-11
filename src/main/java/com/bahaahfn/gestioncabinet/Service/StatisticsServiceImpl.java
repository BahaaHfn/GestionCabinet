package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Doctor;
import com.bahaahfn.gestioncabinet.Repository.AppointmentRepository;
import com.bahaahfn.gestioncabinet.Repository.ConsultationRepository;
import com.bahaahfn.gestioncabinet.Repository.DoctorRepository;
import com.bahaahfn.gestioncabinet.Repository.PatientRepository;
import com.bahaahfn.gestioncabinet.dto.ConsultationTrendDTO;
import com.bahaahfn.gestioncabinet.dto.DashboardStatsDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class StatisticsServiceImpl implements StatisticsService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ConsultationRepository consultationRepository;
    private final AppointmentRepository appointmentRepository;

    public StatisticsServiceImpl(PatientRepository patientRepository,
                                 DoctorRepository doctorRepository,
                                 ConsultationRepository consultationRepository,
                                 AppointmentRepository appointmentRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.consultationRepository = consultationRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public DashboardStatsDTO getDashboardStats() {
        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        long consultationsThisMonth = consultationRepository
            .findByDateBetween(monthStart, LocalDateTime.now())
            .size();

        return DashboardStatsDTO.builder()
            .totalPatients(patientRepository.count())
            .totalDoctors(doctorRepository.count())
            .totalAppointments(appointmentRepository.count())
            .totalConsultations(consultationRepository.count())
            .consultationsThisMonth(consultationsThisMonth)
            .specialtyDistribution(getSpecialityDistribution())
            .build();
    }

    @Override
    public DashboardStatsDTO getDoctorDashboardStats(Long doctorId) {
        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        long consultationsThisMonth = consultationRepository
            .findByDoctor_IdDoctorAndDateBetween(doctorId, monthStart, LocalDateTime.now())
            .size();

        long totalPatients = appointmentRepository.findByDoctor_IdDoctor(doctorId).stream()
            .map(a -> a.getPatient().getIdPatient())
            .distinct()
            .count();

        long totalAppointments = appointmentRepository.findByDoctor_IdDoctor(doctorId).size();

        return DashboardStatsDTO.builder()
            .totalPatients(totalPatients)
            .totalDoctors(totalAppointments) // Repurposed for total appointments
            .totalAppointments(totalAppointments)
            .totalConsultations(consultationRepository.countByDoctor_IdDoctor(doctorId))
            .consultationsThisMonth(consultationsThisMonth)
            .specialtyDistribution(new HashMap<>()) // Doctors don't need specialty chart
            .build();
    }

    @Override
    public List<ConsultationTrendDTO> getMonthlyTrends(int monthsCount) {
        List<ConsultationTrendDTO> trends = new ArrayList<>();
        YearMonth currentMonth = YearMonth.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");

        for (int i = monthsCount - 1; i >= 0; i--) {
            YearMonth targetMonth = currentMonth.minusMonths(i);
            LocalDateTime start = targetMonth.atDay(1).atStartOfDay();
            LocalDateTime end = targetMonth.atEndOfMonth().atTime(23, 59, 59);

            long count = consultationRepository.findByDateBetween(start, end).size();
            trends.add(new ConsultationTrendDTO(targetMonth.format(formatter), count));
        }

        return trends;
    }

    @Override
    public List<ConsultationTrendDTO> getDoctorMonthlyTrends(Long doctorId, int monthsCount) {
        List<ConsultationTrendDTO> trends = new ArrayList<>();
        YearMonth currentMonth = YearMonth.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM yyyy");

        for (int i = monthsCount - 1; i >= 0; i--) {
            YearMonth targetMonth = currentMonth.minusMonths(i);
            LocalDateTime start = targetMonth.atDay(1).atStartOfDay();
            LocalDateTime end = targetMonth.atEndOfMonth().atTime(23, 59, 59);

            long count = consultationRepository.findByDoctor_IdDoctorAndDateBetween(doctorId, start, end).size();
            trends.add(new ConsultationTrendDTO(targetMonth.format(formatter), count));
        }

        return trends;
    }

    @Override
    public Map<String, Long> getSpecialityDistribution() {
        return doctorRepository.findAll().stream()
            .filter(d -> d.getSpecialty() != null && !d.getSpecialty().isEmpty())
            .collect(Collectors.groupingBy(Doctor::getSpecialty, Collectors.counting()));
    }
}
