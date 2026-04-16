package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Consultation;

import java.util.List;

public interface ConsultationService {
    void save(Consultation consultation);
    Consultation findConsultationById(long id);
    void delete(long id);
    void update(Consultation consultation);
    void deleteAll();
    List<Consultation> findConsultationsByPatientId(long id);
    List<Consultation> getAllConsultations();
    long countConsultations();
    List<Consultation> getRecentConsultations();
}
