package com.bahaahfn.gestioncabinet.dto;

import com.bahaahfn.gestioncabinet.Entity.Prescription;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrescriptionDTO {
    private Long idPrescription;
    private Long consultationId;
    private Long patientId;
    private String patientFirstName;
    private String patientLastName;
    private Long doctorId;
    private String doctorFirstName;
    private String doctorLastName;
    private String medicationName;
    private String dosage;
    private String frequency;
    private Integer durationDays;
    private String instructions;
    private LocalDateTime datePrescribed;
    private Boolean isActive;

    public PrescriptionDTO(Prescription prescription) {
        this.idPrescription = prescription.getIdPrescription();
        if (prescription.getConsultation() != null) {
            this.consultationId = prescription.getConsultation().getIdConsultation();
        }
        if (prescription.getPatient() != null) {
            this.patientId = prescription.getPatient().getIdPatient();
            if (prescription.getPatient().getUser() != null) {
                this.patientFirstName = prescription.getPatient().getUser().getFirstName();
                this.patientLastName = prescription.getPatient().getUser().getLastName();
            }
        }
        if (prescription.getDoctor() != null) {
            this.doctorId = prescription.getDoctor().getIdDoctor();
            if (prescription.getDoctor().getUser() != null) {
                this.doctorFirstName = prescription.getDoctor().getUser().getFirstName();
                this.doctorLastName = prescription.getDoctor().getUser().getLastName();
            }
        }
        this.medicationName = prescription.getMedicationName();
        this.dosage = prescription.getDosage();
        this.frequency = prescription.getFrequency();
        this.durationDays = prescription.getDurationDays();
        this.instructions = prescription.getInstructions();
        this.datePrescribed = prescription.getDatePrescribed();
        this.isActive = prescription.getIsActive();
    }
}
