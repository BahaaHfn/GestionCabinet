package com.bahaahfn.gestioncabinet.controller;

import com.bahaahfn.gestioncabinet.Service.PrescriptionService;
import com.bahaahfn.gestioncabinet.dto.CreatePrescriptionRequest;
import com.bahaahfn.gestioncabinet.dto.PrescriptionDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<PrescriptionDTO>> getPatientActivePrescriptions(@PathVariable Long patientId) {
        return ResponseEntity.ok(prescriptionService.getActivePrescriptionsForPatient(patientId));
    }

    @GetMapping("/consultation/{consultationId}")
    public ResponseEntity<List<PrescriptionDTO>> getConsultationPrescriptions(@PathVariable Long consultationId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByConsultation(consultationId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<PrescriptionDTO>> getDoctorPrescriptions(@PathVariable Long doctorId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByDoctor(doctorId));
    }

    @PostMapping
    public ResponseEntity<PrescriptionDTO> createPrescription(@RequestBody CreatePrescriptionRequest request) {
        PrescriptionDTO saved = prescriptionService.createPrescription(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}/deactivate")
    public ResponseEntity<Void> deactivatePrescription(@PathVariable Long id) {
        prescriptionService.deactivatePrescription(id);
        return ResponseEntity.ok().build();
    }
}
