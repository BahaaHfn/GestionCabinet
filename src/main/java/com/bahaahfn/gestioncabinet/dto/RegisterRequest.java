package com.bahaahfn.gestioncabinet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private String cin;
    private String accountType; // DOCTOR, PATIENT, ADMIN, etc.
    
    // Conditional fields for Doctor
    private String specialty;
    private String licenseNumber;
    private String officePhone;
    private String officeAddress;
    private Integer yearsOfExperience;
    
    // Conditional fields for Patient
    private LocalDate birthDate;
    private String sex; // MALE, FEMALE, OTHER
    private String bloodType;
    private String allergies;
    private String medicalConditions;
    private String insuranceNumber;
    private String emergencyContact;
}
