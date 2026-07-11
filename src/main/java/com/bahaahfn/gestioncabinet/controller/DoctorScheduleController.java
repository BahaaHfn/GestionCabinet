package com.bahaahfn.gestioncabinet.controller;

import com.bahaahfn.gestioncabinet.Entity.Doctor;
import com.bahaahfn.gestioncabinet.Entity.DoctorSchedule;
import com.bahaahfn.gestioncabinet.Repository.DoctorRepository;
import com.bahaahfn.gestioncabinet.Repository.DoctorScheduleRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
public class DoctorScheduleController {

    private final DoctorScheduleRepository doctorScheduleRepository;
    private final DoctorRepository doctorRepository;

    public DoctorScheduleController(DoctorScheduleRepository doctorScheduleRepository, DoctorRepository doctorRepository) {
        this.doctorScheduleRepository = doctorScheduleRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping("/{doctorId}/schedules")
    public ResponseEntity<List<DoctorSchedule>> getSchedules(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorScheduleRepository.findByDoctor_IdDoctor(doctorId));
    }

    @PostMapping("/{doctorId}/schedules")
    public ResponseEntity<?> addSchedule(@PathVariable Long doctorId, @RequestBody DoctorSchedule schedule) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        schedule.setDoctor(doctor);
        DoctorSchedule saved = doctorScheduleRepository.save(schedule);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @DeleteMapping("/schedules/{scheduleId}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long scheduleId) {
        doctorScheduleRepository.deleteById(scheduleId);
        return ResponseEntity.noContent().build();
    }
}
