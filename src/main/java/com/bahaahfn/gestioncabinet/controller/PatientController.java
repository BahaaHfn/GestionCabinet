package com.bahaahfn.gestioncabinet.controller;

import com.bahaahfn.gestioncabinet.Entity.Patient;
import com.bahaahfn.gestioncabinet.Enum.Sexe;
import com.bahaahfn.gestioncabinet.Service.PatientService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/patients")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public String listPatients(Model model) {
        model.addAttribute("patients", patientService.findAllPatients());
        return "patients/list";
    }
    @GetMapping("/new")
    public String showCreateForm(Model model) {
        model.addAttribute("patient", new Patient());
        model.addAttribute("sexes", Sexe.values());
        return "patients/form";
    }

    @PostMapping
    public String createPatient(@ModelAttribute Patient patient) {
        patientService.save(patient);
        return "redirect:/patients";
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable long id, Model model) {
        Patient patient = patientService.findPatientById(id);
        if (patient == null) {
            return "redirect:/patients";
        }
        model.addAttribute("patient", patient);
        model.addAttribute("sexes", Sexe.values());
        return "patients/form";
    }

    @PostMapping("/update")
    public String updatePatient(@ModelAttribute Patient patient) {
        patientService.update(patient);
        return "redirect:/patients";
    }

    @GetMapping("/delete/{id}")
    public String deletePatient(@PathVariable long id) {
        patientService.delete(id);
        return "redirect:/patients";
    }
}

