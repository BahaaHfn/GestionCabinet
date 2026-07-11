package com.bahaahfn.gestioncabinet.controller;

import com.bahaahfn.gestioncabinet.Entity.Doctor;
import com.bahaahfn.gestioncabinet.Service.DoctorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public ResponseEntity<Page<Doctor>> listDoctors(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Doctor> doctorPage = doctorService.searchDoctors(keyword, PageRequest.of(page, size));
        return ResponseEntity.ok(doctorPage);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.findAllDoctors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> doctorDetail(@PathVariable long id) {
        Doctor doctor = doctorService.findDoctorById(id);
        if (doctor == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok(doctor);
    }

    @PostMapping
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        Doctor saved = doctorService.save(doctor);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable long id, @RequestBody Doctor doctor) {
        doctor.setIdDoctor(id);
        Doctor updated = doctorService.update(doctor);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Docteur non trouvé");
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable long id) {
        doctorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
