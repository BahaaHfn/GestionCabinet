package com.bahaahfn.gestioncabinet.Repository;

import com.bahaahfn.gestioncabinet.Entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
}
