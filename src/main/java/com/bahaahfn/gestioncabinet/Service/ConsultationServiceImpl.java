package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Consultation;
import com.bahaahfn.gestioncabinet.Repository.ConsultationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ConsultationServiceImpl implements ConsultationService {

    private final ConsultationRepository consultationRepository;

    public ConsultationServiceImpl(ConsultationRepository consultationRepository) {
        this.consultationRepository = consultationRepository;
    }

    @Override
    public Consultation save(Consultation consultation) {
        return consultationRepository.save(consultation);
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
    public Consultation update(Consultation consultation) {
        Consultation existing = consultationRepository.findById(consultation.getIdConsultation()).orElse(null);
        if (existing != null) {
            existing.setDate(consultation.getDate());
            existing.setDescription(consultation.getDescription());
            existing.setDiagnosis(consultation.getDiagnosis());
            existing.setTreatmentPlan(consultation.getTreatmentPlan());
            existing.setFollowUpDate(consultation.getFollowUpDate());
            if (consultation.getAppointment() != null) {
                existing.setAppointment(consultation.getAppointment());
            }
            if (consultation.getPatient() != null) {
                existing.setPatient(consultation.getPatient());
            }
            if (consultation.getDoctor() != null) {
                existing.setDoctor(consultation.getDoctor());
            }
            return consultationRepository.save(existing);
        }
        return null;
    }

    @Override
    public void deleteAll() {
        consultationRepository.deleteAll();
    }

    @Override
    public List<Consultation> findConsultationsByPatientId(long id) {
        return consultationRepository.findByPatient_IdPatient(id);
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
