package com.bahaahfn.gestioncabinet.controller;

import com.bahaahfn.gestioncabinet.Entity.Consultation;
import com.bahaahfn.gestioncabinet.Service.ConsultationService;
import com.bahaahfn.gestioncabinet.Service.PatientService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/consultations")
public class ConsultationController {

    private final ConsultationService consultationService;
    private final PatientService patientService;

    public ConsultationController(ConsultationService consultationService, PatientService patientService) {
        this.consultationService = consultationService;
        this.patientService = patientService;
    }

    @GetMapping
    public String listConsultations(Model model) {
        model.addAttribute("consultations", consultationService.getAllConsultations());
        return "consultations/list";
    }

    @GetMapping("/new")
    public String showCreateForm(Model model) {
        model.addAttribute("consultation", new Consultation());
        model.addAttribute("patients", patientService.findAllPatients());
        return "consultations/form";
    }

    @PostMapping
    public String createConsultation(@ModelAttribute Consultation consultation) {
        consultationService.save(consultation);
        return "redirect:/consultations";
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable long id, Model model) {
        Consultation consultation = consultationService.findConsultationById(id);
        if (consultation == null) {
            return "redirect:/consultations";
        }
        model.addAttribute("consultation", consultation);
        model.addAttribute("patients", patientService.findAllPatients());
        return "consultations/form";
    }

    @PostMapping("/update")
    public String updateConsultation(@ModelAttribute Consultation consultation) {
        consultationService.update(consultation);
        return "redirect:/consultations";
    }

    @GetMapping("/delete/{id}")
    public String deleteConsultation(@PathVariable long id) {
        consultationService.delete(id);
        return "redirect:/consultations";
    }
}
