package com.bahaahfn.gestioncabinet.controller;

import com.bahaahfn.gestioncabinet.Entity.Doctor;
import com.bahaahfn.gestioncabinet.Entity.Patient;
import com.bahaahfn.gestioncabinet.Entity.User;
import com.bahaahfn.gestioncabinet.Enum.AccountType;
import com.bahaahfn.gestioncabinet.Repository.DoctorRepository;
import com.bahaahfn.gestioncabinet.Repository.PatientRepository;
import com.bahaahfn.gestioncabinet.Repository.UserRepository;
import com.bahaahfn.gestioncabinet.Service.ConsultationService;
import com.bahaahfn.gestioncabinet.Service.PatientService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;
    private final ConsultationService consultationService;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public PatientController(PatientService patientService, 
                             ConsultationService consultationService,
                             UserRepository userRepository,
                             DoctorRepository doctorRepository,
                             PatientRepository patientRepository) {
        this.patientService = patientService;
        this.consultationService = consultationService;
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

    @GetMapping
    public ResponseEntity<?> listPatients(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (user.getAccountType() == AccountType.PATIENT) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }

        if (user.getAccountType() == AccountType.DOCTOR) {
            Doctor doc = doctorRepository.findByUser_Email(user.getEmail()).orElse(null);
            if (doc == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Doctor profile not found");
            }
            Page<Patient> patients = patientService.findPatientsByDoctor(doc.getIdDoctor(), keyword, PageRequest.of(page, size));
            return ResponseEntity.ok(patients);
        }

        Page<Patient> patientPage = patientService.searchPatients(keyword, PageRequest.of(page, size));
        return ResponseEntity.ok(patientPage);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllPatients() {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (user.getAccountType() == AccountType.PATIENT) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
        }

        if (user.getAccountType() == AccountType.DOCTOR) {
            Doctor doc = doctorRepository.findByUser_Email(user.getEmail()).orElse(null);
            if (doc == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Doctor profile not found");
            }
            return ResponseEntity.ok(patientService.findPatientsByDoctorId(doc.getIdDoctor()));
        }

        return ResponseEntity.ok(patientService.findAllPatients());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> patientDetail(@PathVariable long id) {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Secure Patients
        if (user.getAccountType() == AccountType.PATIENT) {
            Patient pat = patientRepository.findByUser_Email(user.getEmail()).orElse(null);
            if (pat == null || pat.getIdPatient() != id) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied");
            }
        }

        // Secure Doctors
        if (user.getAccountType() == AccountType.DOCTOR) {
            Doctor doc = doctorRepository.findByUser_Email(user.getEmail()).orElse(null);
            if (doc == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Doctor profile not found");
            }
            // Check if patient has any relation (appointments) with doctor
            List<Patient> myPatients = patientService.findPatientsByDoctorId(doc.getIdDoctor());
            boolean isMyPatient = myPatients.stream().anyMatch(p -> p.getIdPatient() == id);
            if (!isMyPatient) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access Denied (Not your patient)");
            }
        }

        Patient patient = patientService.findPatientById(id);
        if (patient == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient non trouvé");
        }
        
        Map<String, Object> details = new HashMap<>();
        details.put("patient", patient);
        details.put("consultations", consultationService.findConsultationsByPatientId(id));
        
        return ResponseEntity.ok(details);
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        Patient saved = patientService.save(patient);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable long id, @RequestBody Patient patient) {
        patient.setIdPatient(id);
        Patient updated = patientService.update(patient);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient non trouvé");
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable long id) {
        patientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
