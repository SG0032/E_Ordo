package org.sid.e_ordonnance.repositories;

import org.sid.e_ordonnance.entities.Pathology;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PathologyRepository extends JpaRepository<Pathology, Long> {
    List<Pathology> findByNameContainingIgnoreCase(String name);
}