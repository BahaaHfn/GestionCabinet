package com.bahaahfn.gestioncabinet.Repository;

import com.bahaahfn.gestioncabinet.Entity.Appointment;
import com.bahaahfn.gestioncabinet.Enum.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient_IdPatient(Long patientId);
    List<Appointment> findByDoctor_IdDoctor(Long doctorId);
    List<Appointment> findByDateOfAppointmentBetween(LocalDateTime start, LocalDateTime end);
    List<Appointment> findByStatus(AppointmentStatus status);
    List<Appointment> findByStatusAndDateOfAppointmentGreaterThan(AppointmentStatus status, LocalDateTime date);
    
    @Query("SELECT a FROM Appointment a WHERE " +
           "(:patientId IS NULL OR a.patient.idPatient = :patientId) AND " +
           "(:doctorId IS NULL OR a.doctor.idDoctor = :doctorId) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:start IS NULL OR a.dateOfAppointment >= :start) AND " +
           "(:end IS NULL OR a.dateOfAppointment <= :end)")
    Page<Appointment> findAppointmentsFiltered(
            @Param("patientId") Long patientId,
            @Param("doctorId") Long doctorId,
            @Param("status") AppointmentStatus status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable
    );

    @Query("SELECT a FROM Appointment a WHERE " +
           "(:patientId IS NULL OR a.patient.idPatient = :patientId) AND " +
           "(:doctorId IS NULL OR a.doctor.idDoctor = :doctorId) AND " +
           "(a.status = 'SCHEDULED' AND a.dateOfAppointment >= :nowMinus30) AND " +
           "(:start IS NULL OR a.dateOfAppointment >= :start) AND " +
           "(:end IS NULL OR a.dateOfAppointment <= :end)")
    Page<Appointment> findUpcomingAppointments(
            @Param("patientId") Long patientId,
            @Param("doctorId") Long doctorId,
            @Param("nowMinus30") LocalDateTime nowMinus30,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable
    );

    @Query("SELECT a FROM Appointment a WHERE " +
           "(:patientId IS NULL OR a.patient.idPatient = :patientId) AND " +
           "(:doctorId IS NULL OR a.doctor.idDoctor = :doctorId) AND " +
           "(a.status = 'COMPLETED') AND " +
           "(:start IS NULL OR a.dateOfAppointment >= :start) AND " +
           "(:end IS NULL OR a.dateOfAppointment <= :end)")
    Page<Appointment> findFinishedAppointments(
            @Param("patientId") Long patientId,
            @Param("doctorId") Long doctorId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable
    );

    @Query("SELECT a FROM Appointment a WHERE " +
           "(:patientId IS NULL OR a.patient.idPatient = :patientId) AND " +
           "(:doctorId IS NULL OR a.doctor.idDoctor = :doctorId) AND " +
           "(a.status = 'NO_SHOW' OR (a.status = 'SCHEDULED' AND a.dateOfAppointment < :nowMinus30)) AND " +
           "(:start IS NULL OR a.dateOfAppointment >= :start) AND " +
           "(:end IS NULL OR a.dateOfAppointment <= :end)")
    Page<Appointment> findMissedAppointments(
            @Param("patientId") Long patientId,
            @Param("doctorId") Long doctorId,
            @Param("nowMinus30") LocalDateTime nowMinus30,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end,
            Pageable pageable
    );
    
    // For conflict checking: find appointments for a doctor in a range that aren't CANCELLED
    List<Appointment> findByDoctor_IdDoctorAndStatusNotAndDateOfAppointmentBetween(
        Long doctorId, AppointmentStatus status, LocalDateTime start, LocalDateTime end
    );
    
    // Cabinet_Medical inspired notification and scheduling queries
    List<Appointment> findByDateOfAppointmentGreaterThanAndNotificationFalse(LocalDateTime date);
    List<Appointment> findByDateOfAppointmentLessThan(LocalDateTime date);
}
