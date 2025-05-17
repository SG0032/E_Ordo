package org.sid.e_ordonnance.repositories;

import org.sid.e_ordonnance.entities.Guideline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GuidelineRepository extends JpaRepository<Guideline, Long> {
    Optional<Guideline> findByPathologyId(Long pathologyId);
}