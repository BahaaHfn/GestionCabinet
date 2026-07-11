package com.bahaahfn.gestioncabinet.Service;

import com.bahaahfn.gestioncabinet.Entity.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface DoctorService {
    Doctor save(Doctor doctor);
    Doctor findDoctorById(long id);
    void delete(long id);
    Doctor update(Doctor doctor);
    List<Doctor> findAllDoctors();
    Page<Doctor> searchDoctors(String keyword, Pageable pageable);
    long countDoctors();
    Doctor findByEmail(String email);
}
