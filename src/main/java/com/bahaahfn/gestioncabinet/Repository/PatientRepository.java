package com.bahaahfn.gestioncabinet.Repository;

import com.bahaahfn.gestioncabinet.Entity.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Page<Patient> findByUser_FirstNameContainingIgnoreCaseOrUser_LastNameContainingIgnoreCase(
        String firstName, String lastName, Pageable pageable
    );
    Optional<Patient> findByUser_Email(String email);
    List<Patient> findByBirthDateBetween(LocalDate start, LocalDate end);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p FROM Patient p JOIN p.appointments a WHERE " +
           "a.doctor.idDoctor = :doctorId AND " +
           "(:keyword = '' OR LOWER(p.user.firstName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(p.user.lastName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Patient> findPatientsByDoctor(@org.springframework.data.repository.query.Param("doctorId") Long doctorId,
                                       @org.springframework.data.repository.query.Param("keyword") String keyword,
                                       Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT p FROM Patient p JOIN p.appointments a WHERE a.doctor.idDoctor = :doctorId")
    List<Patient> findPatientsByDoctorId(@org.springframework.data.repository.query.Param("doctorId") Long doctorId);
}
