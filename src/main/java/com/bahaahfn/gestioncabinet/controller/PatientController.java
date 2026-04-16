package com.bahaahfn.gestioncabinet.controller;

import com.bahaahfn.gestioncabinet.Entity.Patient;
import com.bahaahfn.gestioncabinet.Enum.Sexe;
import com.bahaahfn.gestioncabinet.Service.ConsultationService;
import com.bahaahfn.gestioncabinet.Service.PatientService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/patients")
public class PatientController {

    private final PatientService patientService;
    private final ConsultationService consultationService;

    public PatientController(PatientService patientService, ConsultationService consultationService) {
        this.patientService = patientService;
        this.consultationService = consultationService;
    }

    @GetMapping
    public String listPatients(Model model,
                               @RequestParam(defaultValue = "") String keyword,
                               @RequestParam(defaultValue = "0") int page,
                               @RequestParam(defaultValue = "5") int size) {
        Page<Patient> patientPage = patientService.searchPatients(keyword, PageRequest.of(page, size));
        model.addAttribute("patients", patientPage.getContent());
        model.addAttribute("totalPages", patientPage.getTotalPages());
        model.addAttribute("currentPageNum", page);
        model.addAttribute("keyword", keyword);
        model.addAttribute("size", size);
        model.addAttribute("currentPage", "patients");
        return "patients/list";
    }

    @GetMapping("/{id}")
    public String patientDetail(@PathVariable long id, Model model) {
        Patient patient = patientService.findPatientById(id);
        if (patient == null) {
            return "redirect:/patients";
        }
        model.addAttribute("patient", patient);
        model.addAttribute("consultations", consultationService.findConsultationsByPatientId(id));
        model.addAttribute("currentPage", "patients");
        return "patients/detail";
    }

    @GetMapping("/new")
    public String showCreateForm(Model model) {
        model.addAttribute("patient", new Patient());
        model.addAttribute("sexes", Sexe.values());
        model.addAttribute("currentPage", "patients");
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
        model.addAttribute("currentPage", "patients");
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
