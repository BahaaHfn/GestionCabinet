package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Consultation;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsultationServiceImpl implements ConsultationService {
    @Override
    public void save(Consultation consultation) {

    }

    @Override
    public Consultation findConsultationById(long id) {
        return null;
    }

    @Override
    public void delete(long id) {

    }

    @Override
    public void update(Consultation consultation) {

    }

    @Override
    public void deleteAll() {

    }

    @Override
    public Consultation findConsultationByPatientId(long id) {
        return null;
    }

    @Override
    public List<Consultation> getAllConsultations() {
        return List.of();
    }
}
