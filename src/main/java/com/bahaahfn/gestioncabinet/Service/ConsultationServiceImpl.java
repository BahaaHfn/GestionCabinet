package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Consultation;
import com.bahaahfn.gestioncabinet.Repository.ConsultationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsultationServiceImpl implements ConsultationService {

    private final ConsultationRepository consultationRepository;

    public ConsultationServiceImpl(ConsultationRepository consultationRepository) {
        this.consultationRepository = consultationRepository;
    }

    @Override
    public void save(Consultation consultation) {
        consultationRepository.save(consultation);
    }

    @Override
    public Consultation findConsultationById(long id) {
        return consultationRepository.findById(id).orElse(null);
    }

    @Override
    public void delete(long id) {
        consultationRepository.deleteById(id);
    }

    @Override
    public void update(Consultation consultation) {
        consultationRepository.save(consultation);
    }

    @Override
    public void deleteAll() {
        consultationRepository.deleteAll();
    }

    @Override
    public List<Consultation> findConsultationsByPatientId(long id) {
        return consultationRepository.findByPatientId(id);
    }

    @Override
    public List<Consultation> getAllConsultations() {
        return consultationRepository.findAll();
    }

    @Override
    public long countConsultations() {
        return consultationRepository.count();
    }

    @Override
    public List<Consultation> getRecentConsultations() {
        return consultationRepository.findTop5ByOrderByDateDesc();
    }
}
