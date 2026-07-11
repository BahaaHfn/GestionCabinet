package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.dto.AppointmentDTO;
import com.bahaahfn.gestioncabinet.dto.CreateAppointmentRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentService {
    List<AppointmentDTO> getUpcomingAppointments();
    List<AppointmentDTO> getFinishedAppointments();
    Page<AppointmentDTO> getAppointmentsPage(Long patientId, Long doctorId, String status, LocalDateTime start, LocalDateTime end, Pageable pageable);
    Page<AppointmentDTO> getUpcomingAppointmentsPage(Long patientId, Long doctorId, LocalDateTime start, LocalDateTime end, Pageable pageable);
    Page<AppointmentDTO> getFinishedAppointmentsPage(Long patientId, Long doctorId, LocalDateTime start, LocalDateTime end, Pageable pageable);
    Page<AppointmentDTO> getMissedAppointmentsPage(Long patientId, Long doctorId, LocalDateTime start, LocalDateTime end, Pageable pageable);
    boolean checkConflict(Long doctorId, LocalDateTime appointmentDate, int durationMinutes);
    AppointmentDTO takeAppointment(CreateAppointmentRequest request);
    void markAppointmentsNotified();
    int getUnnotifiedAppointmentCount();
    void deleteAppointment(Long id);
    AppointmentDTO updateAppointment(Long id, CreateAppointmentRequest request);
    AppointmentDTO completeAppointment(Long appointmentId, String diagnosis, String typeOfIllness, String medicationName, String dosage, String frequency, Integer durationDays);
    List<AppointmentDTO> getAppointmentsByDoctor(Long doctorId);
    List<AppointmentDTO> getAppointmentsByPatient(Long patientId);
}
