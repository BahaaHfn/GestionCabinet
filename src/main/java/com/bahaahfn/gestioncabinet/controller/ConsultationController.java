package com.bahaahfn.gestioncabinet.controller;

import com.bahaahfn.gestioncabinet.Entity.Consultation;
import com.bahaahfn.gestioncabinet.Service.ConsultationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/consultations")
public class ConsultationController {

    private final ConsultationService consultationService;

    public ConsultationController(ConsultationService consultationService) {
        this.consultationService = consultationService;
    }

    @GetMapping
    public ResponseEntity<List<Consultation>> getAllConsultations() {
        return ResponseEntity.ok(consultationService.getAllConsultations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Consultation> getConsultationDetail(@PathVariable long id) {
        Consultation consultation = consultationService.findConsultationById(id);
        if (consultation == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(consultation);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Consultation>> getPatientConsultations(@PathVariable long patientId) {
        return ResponseEntity.ok(consultationService.findConsultationsByPatientId(patientId));
    }

    @PostMapping
    public ResponseEntity<Consultation> createConsultation(@RequestBody Consultation consultation) {
        Consultation saved = consultationService.save(consultation);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateConsultation(@PathVariable long id, @RequestBody Consultation consultation) {
        consultation.setIdConsultation(id);
        Consultation updated = consultationService.update(consultation);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Consultation non trouvée");
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable long id) {
        consultationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
