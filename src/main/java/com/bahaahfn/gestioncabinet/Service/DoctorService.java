package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DoctorService {
    void save(Doctor doctor);
    Doctor findDoctorById(long id);
    void delete(long id);
    void update(Doctor doctor);
    List<Doctor> findAllDoctors();
    Page<Doctor> searchDoctors(String keyword, Pageable pageable);
    long countDoctors();
    Doctor findByEmail(String email);
}

