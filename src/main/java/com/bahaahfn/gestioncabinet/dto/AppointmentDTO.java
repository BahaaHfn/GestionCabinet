package com.bahaahfn.gestioncabinet.dto;

import com.bahaahfn.gestioncabinet.Entity.Appointment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentDTO {
    private Long idAppointment;
    private Long patientId;
    private String patientFirstName;
    private String patientLastName;
    private Long doctorId;
    private String doctorFirstName;
    private String doctorLastName;
    private String doctorSpecialty;
    private LocalDateTime dateOfAppointment;
    private LocalDateTime dateOfChecking;
    private String typeOfIllness;
    private String description;
    private String status;
    private Boolean notification;
    private String notes;

    public AppointmentDTO(Appointment appointment) {
        this.idAppointment = appointment.getIdAppointment();
        if (appointment.getPatient() != null) {
            this.patientId = appointment.getPatient().getIdPatient();
            if (appointment.getPatient().getUser() != null) {
                this.patientFirstName = appointment.getPatient().getUser().getFirstName();
                this.patientLastName = appointment.getPatient().getUser().getLastName();
            }
        }
        if (appointment.getDoctor() != null) {
            this.doctorId = appointment.getDoctor().getIdDoctor();
            this.doctorSpecialty = appointment.getDoctor().getSpecialty();
            if (appointment.getDoctor().getUser() != null) {
                this.doctorFirstName = appointment.getDoctor().getUser().getFirstName();
                this.doctorLastName = appointment.getDoctor().getUser().getLastName();
            }
        }
        this.dateOfAppointment = appointment.getDateOfAppointment();
        this.dateOfChecking = appointment.getDateOfChecking();
        this.typeOfIllness = appointment.getTypeOfIllness();
        this.description = appointment.getDescription();
        if (appointment.getStatus() != null) {
            this.status = appointment.getStatus().name();
        }
        this.notification = appointment.getNotification();
        this.notes = appointment.getNotes();
    }
}
