package org.sid.e_ordonnance.repositories;

import org.sid.e_ordonnance.entities.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPathologyId(Long pathologyId);
}