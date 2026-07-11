package com.bahaahfn.gestioncabinet.Repository;

import com.bahaahfn.gestioncabinet.Entity.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {
    List<DoctorSchedule> findByDoctor_IdDoctor(Long doctorId);
}
