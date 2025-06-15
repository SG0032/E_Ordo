package org.sid.e_ordonnance.repositories;

import org.sid.e_ordonnance.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByUserType(User.UserType userType);
    List<User> findByVerificationStatus(User.VerificationStatus verificationStatus);
    List<User> findByUserTypeAndVerificationStatus(User.UserType userType, User.VerificationStatus verificationStatus);
}