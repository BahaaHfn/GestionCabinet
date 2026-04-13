package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Consultation;

import java.util.List;

public interface ConsultationService {
    void save(Consultation consultation);
    Consultation findConsultationById(long id);
    void delete(long id);
    void update(Consultation consultation);
    void deleteAll();
    Consultation findConsultationByPatientId(long id);
    List<Consultation> getAllConsultations();
}
