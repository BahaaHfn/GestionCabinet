package com.bahaahfn.gestioncabinet.controller;

import com.bahaahfn.gestioncabinet.Entity.Doctor;
import com.bahaahfn.gestioncabinet.Entity.User;
import com.bahaahfn.gestioncabinet.Enum.AccountType;
import com.bahaahfn.gestioncabinet.Repository.DoctorRepository;
import com.bahaahfn.gestioncabinet.Repository.UserRepository;
import com.bahaahfn.gestioncabinet.Service.StatisticsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    private final StatisticsService statisticsService;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public StatisticsController(StatisticsService statisticsService,
                                UserRepository userRepository,
                                DoctorRepository doctorRepository) {
        this.statisticsService = statisticsService;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
    }

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (user.getAccountType() == AccountType.DOCTOR) {
            Doctor doc = doctorRepository.findByUser_Email(user.getEmail()).orElse(null);
            if (doc == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Doctor profile not found");
            }
            return ResponseEntity.ok(statisticsService.getDoctorDashboardStats(doc.getIdDoctor()));
        }

        return ResponseEntity.ok(statisticsService.getDashboardStats());
    }

    @GetMapping("/trends/monthly")
    public ResponseEntity<?> getMonthlyTrends(
            @RequestParam(defaultValue = "6") int months) {
        
        User user = getAuthenticatedUser();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (user.getAccountType() == AccountType.DOCTOR) {
            Doctor doc = doctorRepository.findByUser_Email(user.getEmail()).orElse(null);
            if (doc == null) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Doctor profile not found");
            }
            return ResponseEntity.ok(statisticsService.getDoctorMonthlyTrends(doc.getIdDoctor(), months));
        }

        return ResponseEntity.ok(statisticsService.getMonthlyTrends(months));
    }

    @GetMapping("/specialities")
    public ResponseEntity<Map<String, Long>> getSpecialityDistribution() {
        return ResponseEntity.ok(statisticsService.getSpecialityDistribution());
    }
}
