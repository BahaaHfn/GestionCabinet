package com.bahaahfn.gestioncabinet.controller;

import com.bahaahfn.gestioncabinet.Entity.Doctor;
import com.bahaahfn.gestioncabinet.Entity.Patient;
import com.bahaahfn.gestioncabinet.Entity.User;
import com.bahaahfn.gestioncabinet.Enum.AccountType;
import com.bahaahfn.gestioncabinet.Repository.DoctorRepository;
import com.bahaahfn.gestioncabinet.Repository.PatientRepository;
import com.bahaahfn.gestioncabinet.Repository.UserRepository;
import com.bahaahfn.gestioncabinet.Service.AppointmentService;
import com.bahaahfn.gestioncabinet.dto.AppointmentDTO;
import com.bahaahfn.gestioncabinet.dto.CreateAppointmentRequest;
import com.bahaahfn.gestioncabinet.dto.CompleteAppointmentRequest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public AppointmentController(AppointmentService appointmentService,
                                 UserRepository userRepository,
                                 DoctorRepository doctorRepository,
                                 PatientRepository patientRepository) {
        this.appointmentService = appointmentService;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }

    private LocalDateTime parseDateTime(String isoString) {
        if (isoString == null || isoString.isEmpty()) {
            return null;
        }
        try {
            return LocalDateTime.parse(isoString);
        } catch (Exception e) {
            try {
                return java.time.LocalDate.parse(isoString).atStartOfDay();
            } catch (Exception ex) {
                return null;
            }
        }
    }

    @GetMapping("/upcoming")
    public ResponseEntity<?> getUpcomingAppointments(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Apply role-based privacy filters
        if (user.getAccountType() == AccountType.DOCTOR) {
            Doctor doc = doctorRepository.findByUser_Email(user.getEmail()).orElse(null);
            if (doc == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Doctor profile not found");
            doctorId = doc.getIdDoctor();
        } else if (user.getAccountType() == AccountType.PATIENT) {
            Patient pat = patientRepository.findByUser_Email(user.getEmail()).orElse(null);
            if (pat == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Patient profile not found");
            patientId = pat.getIdPatient();
        }

        LocalDateTime start = parseDateTime(startDate);
        LocalDateTime end = parseDateTime(endDate);

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(appointmentService.getUpcomingAppointmentsPage(
                patientId, doctorId, start, end, pageable
        ));
    }

    @GetMapping("/finished")
    public ResponseEntity<?> getFinishedAppointments(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Apply role-based privacy filters
        if (user.getAccountType() == AccountType.DOCTOR) {
            Doctor doc = doctorRepository.findByUser_Email(user.getEmail()).orElse(null);
            if (doc == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Doctor profile not found");
            doctorId = doc.getIdDoctor();
        } else if (user.getAccountType() == AccountType.PATIENT) {
            Patient pat = patientRepository.findByUser_Email(user.getEmail()).orElse(null);
            if (pat == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Patient profile not found");
            patientId = pat.getIdPatient();
        }

        LocalDateTime start = parseDateTime(startDate);
        LocalDateTime end = parseDateTime(endDate);

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(appointmentService.getFinishedAppointmentsPage(
                patientId, doctorId, start, end, pageable
        ));
    }

    @GetMapping("/missed")
    public ResponseEntity<?> getMissedAppointments(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Apply role-based privacy filters
        if (user.getAccountType() == AccountType.DOCTOR) {
            Doctor doc = doctorRepository.findByUser_Email(user.getEmail()).orElse(null);
            if (doc == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Doctor profile not found");
            doctorId = doc.getIdDoctor();
        } else if (user.getAccountType() == AccountType.PATIENT) {
            Patient pat = patientRepository.findByUser_Email(user.getEmail()).orElse(null);
            if (pat == null) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Patient profile not found");
            patientId = pat.getIdPatient();
        }

        LocalDateTime start = parseDateTime(startDate);
        LocalDateTime end = parseDateTime(endDate);

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(appointmentService.getMissedAppointmentsPage(
                patientId, doctorId, start, end, pageable
        ));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<?> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (user.getAccountType() == AccountType.DOCTOR) {
            Doctor doc = doctorRepository.findByUser_Email(user.getEmail()).orElse(null);
            if (doc == null || !doc.getIdDoctor().equals(doctorId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
            }
        }

        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getAppointmentsByPatient(@PathVariable Long patientId) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (user.getAccountType() == AccountType.PATIENT) {
            Patient pat = patientRepository.findByUser_Email(user.getEmail()).orElse(null);
            if (pat == null || !pat.getIdPatient().equals(patientId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
            }
        }

        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody CreateAppointmentRequest request) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        if (user.getAccountType() == AccountType.DOCTOR) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Doctors are not allowed to book appointments");
        }
        try {
            AppointmentDTO saved = appointmentService.takeAppointment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id, @RequestBody CreateAppointmentRequest request) {
        try {
            AppointmentDTO updated = appointmentService.updateAppointment(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeAppointment(
            @PathVariable Long id,
            @RequestBody CompleteAppointmentRequest request) {
        
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        if (user.getAccountType() != AccountType.DOCTOR && user.getAccountType() != AccountType.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }
        
        try {
            AppointmentDTO updated = appointmentService.completeAppointment(
                id,
                request.getDiagnosis(),
                request.getTypeOfIllness(),
                request.getMedicationName(),
                request.getDosage(),
                request.getFrequency(),
                request.getDurationDays()
            );
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
