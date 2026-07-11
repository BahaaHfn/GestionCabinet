package com.bahaahfn.gestioncabinet.controller;

import com.bahaahfn.gestioncabinet.Entity.Doctor;
import com.bahaahfn.gestioncabinet.Service.DoctorService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public String listDoctors(Model model,
                              @RequestParam(defaultValue = "") String keyword,
                              @RequestParam(defaultValue = "0") int page,
                              @RequestParam(defaultValue = "5") int size) {
        Page<Doctor> doctorPage = doctorService.searchDoctors(keyword, PageRequest.of(page, size));
        model.addAttribute("doctors", doctorPage.getContent());
        model.addAttribute("totalPages", doctorPage.getTotalPages());
        model.addAttribute("currentPageNum", page);
        model.addAttribute("keyword", keyword);
        model.addAttribute("size", size);
        model.addAttribute("currentPage", "doctors");
        return "doctors/list";
    }

    @GetMapping("/{id}")
    public String doctorDetail(@PathVariable long id, Model model) {
        Doctor doctor = doctorService.findDoctorById(id);
        if (doctor == null) {
            return "redirect:/doctors";
        }
        model.addAttribute("doctor", doctor);
        model.addAttribute("currentPage", "doctors");
        return "doctors/detail";
    }

    @GetMapping("/new")
    public String showCreateForm(Model model) {
        model.addAttribute("doctor", new Doctor());
        model.addAttribute("currentPage", "doctors");
        return "doctors/form";
    }

    @PostMapping
    public String createDoctor(@ModelAttribute Doctor doctor) {
        doctorService.save(doctor);
        return "redirect:/doctors";
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable long id, Model model) {
        Doctor doctor = doctorService.findDoctorById(id);
        if (doctor == null) {
            return "redirect:/doctors";
        }
        model.addAttribute("doctor", doctor);
        model.addAttribute("currentPage", "doctors");
        return "doctors/form";
    }

    @PostMapping("/update")
    public String updateDoctor(@ModelAttribute Doctor doctor) {
        doctorService.update(doctor);
        return "redirect:/doctors";
    }

    @GetMapping("/delete/{id}")
    public String deleteDoctor(@PathVariable long id) {
        doctorService.delete(id);
        return "redirect:/doctors";
    }
}

