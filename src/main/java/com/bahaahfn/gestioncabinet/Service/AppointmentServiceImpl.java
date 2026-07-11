package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Appointment;
import com.bahaahfn.gestioncabinet.Entity.Doctor;
import com.bahaahfn.gestioncabinet.Entity.DoctorSchedule;
import com.bahaahfn.gestioncabinet.Entity.Patient;
import com.bahaahfn.gestioncabinet.Enum.AppointmentStatus;
import com.bahaahfn.gestioncabinet.Repository.AppointmentRepository;
import com.bahaahfn.gestioncabinet.Repository.DoctorRepository;
import com.bahaahfn.gestioncabinet.Repository.DoctorScheduleRepository;
import com.bahaahfn.gestioncabinet.Repository.PatientRepository;
import com.bahaahfn.gestioncabinet.dto.AppointmentDTO;
import com.bahaahfn.gestioncabinet.dto.CreateAppointmentRequest;
import org.springframework.data.domain.Page;
import com.bahaahfn.gestioncabinet.Entity.Consultation;
import com.bahaahfn.gestioncabinet.Entity.Prescription;
import com.bahaahfn.gestioncabinet.Repository.ConsultationRepository;
import com.bahaahfn.gestioncabinet.Repository.PrescriptionRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final ConsultationRepository consultationRepository;
    private final PrescriptionRepository prescriptionRepository;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
                                  DoctorRepository doctorRepository,
                                  PatientRepository patientRepository,
                                  DoctorScheduleRepository doctorScheduleRepository,
                                  ConsultationRepository consultationRepository,
                                  PrescriptionRepository prescriptionRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.doctorScheduleRepository = doctorScheduleRepository;
        this.consultationRepository = consultationRepository;
        this.prescriptionRepository = prescriptionRepository;
    }

    @Override
    public List<AppointmentDTO> getUpcomingAppointments() {
        return appointmentRepository
            .findByDateOfAppointmentGreaterThanAndNotificationFalse(LocalDateTime.now())
            .stream()
            .map(AppointmentDTO::new)
            .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getFinishedAppointments() {
        return appointmentRepository
            .findByDateOfAppointmentLessThan(LocalDateTime.now())
            .stream()
            .map(AppointmentDTO::new)
            .collect(Collectors.toList());
    }

    @Override
    public Page<AppointmentDTO> getAppointmentsPage(Long patientId, Long doctorId, String status, LocalDateTime start, LocalDateTime end, Pageable pageable) {
        AppointmentStatus apptStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                apptStatus = AppointmentStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // ignore
            }
        }
        return appointmentRepository.findAppointmentsFiltered(patientId, doctorId, apptStatus, start, end, pageable)
                .map(AppointmentDTO::new);
    }

    @Override
    public Page<AppointmentDTO> getUpcomingAppointmentsPage(Long patientId, Long doctorId, LocalDateTime start, LocalDateTime end, Pageable pageable) {
        LocalDateTime nowMinus30 = LocalDateTime.now().minusMinutes(30);
        return appointmentRepository.findUpcomingAppointments(patientId, doctorId, nowMinus30, start, end, pageable)
                .map(AppointmentDTO::new);
    }

    @Override
    public Page<AppointmentDTO> getFinishedAppointmentsPage(Long patientId, Long doctorId, LocalDateTime start, LocalDateTime end, Pageable pageable) {
        return appointmentRepository.findFinishedAppointments(patientId, doctorId, start, end, pageable)
                .map(AppointmentDTO::new);
    }

    @Override
    public Page<AppointmentDTO> getMissedAppointmentsPage(Long patientId, Long doctorId, LocalDateTime start, LocalDateTime end, Pageable pageable) {
        LocalDateTime nowMinus30 = LocalDateTime.now().minusMinutes(30);
        return appointmentRepository.findMissedAppointments(patientId, doctorId, nowMinus30, start, end, pageable)
                .map(AppointmentDTO::new);
    }

    private void validateDoctorSchedule(Long doctorId, LocalDateTime dateTime, int durationMinutes) {
        List<DoctorSchedule> schedules = doctorScheduleRepository.findByDoctor_IdDoctor(doctorId);
        if (schedules.isEmpty()) {
            int day = dateTime.getDayOfWeek().getValue();
            if (day > 5) {
                throw new IllegalArgumentException("Le docteur ne travaille pas les week-ends par défaut");
            }
            LocalTime time = dateTime.toLocalTime();
            LocalTime workStart = LocalTime.of(8, 0);
            LocalTime workEnd = LocalTime.of(18, 0);
            if (time.isBefore(workStart) || time.plusMinutes(durationMinutes).isAfter(workEnd)) {
                throw new IllegalArgumentException("Le rendez-vous est en dehors des heures de travail standard (08:00 - 18:00)");
            }
            return;
        }

        int dayOfWeek = dateTime.getDayOfWeek().getValue() - 1;
        LocalTime apptTime = dateTime.toLocalTime();
        LocalTime apptEndTime = apptTime.plusMinutes(durationMinutes);

        boolean insideSchedule = false;
        for (DoctorSchedule schedule : schedules) {
            if (schedule.getDayOfWeek() != null && schedule.getDayOfWeek() == dayOfWeek) {
                if (!apptTime.isBefore(schedule.getStartTime()) && !apptEndTime.isAfter(schedule.getEndTime())) {
                    insideSchedule = true;
                    break;
                }
            }
        }

        if (!insideSchedule) {
            throw new IllegalArgumentException("Le docteur ne travaille pas pendant ce créneau horaire");
        }
    }

    @Override
    public boolean checkConflict(Long doctorId, LocalDateTime appointmentDate, int durationMinutes) {
        LocalDateTime endTime = appointmentDate.plusMinutes(durationMinutes);
        // Find existing non-cancelled appointments in the same slot
        List<Appointment> existing = appointmentRepository
            .findByDoctor_IdDoctorAndStatusNotAndDateOfAppointmentBetween(
                doctorId, AppointmentStatus.CANCELLED, appointmentDate.minusMinutes(durationMinutes - 1), endTime.minusMinutes(1)
            );
        return !existing.isEmpty();
    }

    @Override
    public AppointmentDTO takeAppointment(CreateAppointmentRequest request) {
        validateDoctorSchedule(request.getDoctorId(), request.getAppointmentDate(), 30);
        if (checkConflict(request.getDoctorId(), request.getAppointmentDate(), 30)) {
            throw new IllegalArgumentException("This time slot is not available");
        }

        Patient patient = patientRepository.findById(request.getPatientId())
            .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + request.getPatientId()));
        
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
            .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + request.getDoctorId()));

        Appointment appointment = Appointment.builder()
            .patient(patient)
            .doctor(doctor)
            .dateOfAppointment(request.getAppointmentDate())
            .typeOfIllness(request.getTypeofIllness())
            .description(request.getDescription())
            .status(AppointmentStatus.SCHEDULED)
            .notification(false)
            .build();

        return new AppointmentDTO(appointmentRepository.save(appointment));
    }

    @Override
    public void markAppointmentsNotified() {
        List<Appointment> unnotified = appointmentRepository
            .findByDateOfAppointmentGreaterThanAndNotificationFalse(LocalDateTime.now());
        unnotified.forEach(a -> {
            a.setNotification(true);
            a.setNotificationSentAt(LocalDateTime.now());
        });
        appointmentRepository.saveAll(unnotified);
    }

    @Override
    public int getUnnotifiedAppointmentCount() {
        return (int) appointmentRepository.findAll().stream()
            .filter(a -> !a.getNotification() && a.getDateOfAppointment().isAfter(LocalDateTime.now()))
            .count();
    }

    @Override
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }

    @Override
    public AppointmentDTO updateAppointment(Long id, CreateAppointmentRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        Long finalDoctorId = request.getDoctorId() != null ? request.getDoctorId() : appointment.getDoctor().getIdDoctor();
        LocalDateTime finalDate = request.getAppointmentDate() != null ? request.getAppointmentDate() : appointment.getDateOfAppointment();

        if (request.getDoctorId() != null || request.getAppointmentDate() != null) {
            validateDoctorSchedule(finalDoctorId, finalDate, 30);
        }

        if (request.getDoctorId() != null && !request.getDoctorId().equals(appointment.getDoctor().getIdDoctor())) {
            Doctor newDoctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
            appointment.setDoctor(newDoctor);
        }
        
        if (request.getAppointmentDate() != null) {
            // Check conflict if doctor or date changed
            boolean doctorChanged = request.getDoctorId() != null && !request.getDoctorId().equals(appointment.getDoctor().getIdDoctor());
            boolean dateChanged = !request.getAppointmentDate().equals(appointment.getDateOfAppointment());
            if ((doctorChanged || dateChanged) && checkConflict(appointment.getDoctor().getIdDoctor(), request.getAppointmentDate(), 30)) {
                throw new IllegalArgumentException("This time slot is not available");
            }
            appointment.setDateOfAppointment(request.getAppointmentDate());
        }
        
        if (request.getTypeofIllness() != null) {
            appointment.setTypeOfIllness(request.getTypeofIllness());
        }
        
        if (request.getDescription() != null) {
            appointment.setDescription(request.getDescription());
        }
        
        return new AppointmentDTO(appointmentRepository.save(appointment));
    }

    @Override
    public List<AppointmentDTO> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctor_IdDoctor(doctorId)
            .stream()
            .map(AppointmentDTO::new)
            .collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDTO> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatient_IdPatient(patientId)
            .stream()
            .map(AppointmentDTO::new)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AppointmentDTO completeAppointment(Long appointmentId, String diagnosis, String typeOfIllness, String medicationName, String dosage, String frequency, Integer durationDays) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
            
        appointment.setStatus(AppointmentStatus.COMPLETED);
        if (typeOfIllness != null && !typeOfIllness.isEmpty()) {
            appointment.setTypeOfIllness(typeOfIllness);
        }
        appointment = appointmentRepository.save(appointment);
        
        // Create Consultation
        Consultation consultation = Consultation.builder()
            .appointment(appointment)
            .patient(appointment.getPatient())
            .doctor(appointment.getDoctor())
            .date(LocalDateTime.now())
            .diagnosis(diagnosis)
            .description(diagnosis)
            .build();
        consultation = consultationRepository.save(consultation);
        
        // Create Prescription if medication is specified
        if (medicationName != null && !medicationName.trim().isEmpty()) {
            Prescription prescription = Prescription.builder()
                .consultation(consultation)
                .patient(appointment.getPatient())
                .doctor(appointment.getDoctor())
                .medicationName(medicationName)
                .dosage(dosage != null && !dosage.isEmpty() ? dosage : "1 tab")
                .frequency(frequency != null && !frequency.isEmpty() ? frequency : "Once daily")
                .durationDays(durationDays != null ? durationDays : 7)
                .isActive(true)
                .build();
            prescriptionRepository.save(prescription);
        }
        
        return new AppointmentDTO(appointment);
    }
}
