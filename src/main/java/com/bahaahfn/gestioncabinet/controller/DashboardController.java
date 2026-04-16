package com.bahaahfn.gestioncabinet.controller;

import com.bahaahfn.gestioncabinet.Service.ConsultationService;
import com.bahaahfn.gestioncabinet.Service.PatientService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {

    private final PatientService patientService;
    private final ConsultationService consultationService;

    public DashboardController(PatientService patientService, ConsultationService consultationService) {
        this.patientService = patientService;
        this.consultationService = consultationService;
    }

    @GetMapping("/")
    public String dashboard(Model model) {
        model.addAttribute("totalPatients", patientService.countPatients());
        model.addAttribute("totalConsultations", consultationService.countConsultations());
        model.addAttribute("recentConsultations", consultationService.getRecentConsultations());
        model.addAttribute("currentPage", "dashboard");
        return "dashboard";
    }
}

