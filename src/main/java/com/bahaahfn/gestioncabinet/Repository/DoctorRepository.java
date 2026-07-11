package com.bahaahfn.gestioncabinet.Repository;

import com.bahaahfn.gestioncabinet.Entity.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Page<Doctor> findBySpecialtyContainingIgnoreCase(String specialty, Pageable pageable);
    Optional<Doctor> findByUser_Email(String email);
    List<Doctor> findBySpecialtyAndIsAvailableTrue(String specialty);
}
