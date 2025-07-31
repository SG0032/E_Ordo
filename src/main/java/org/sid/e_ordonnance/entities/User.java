package org.sid.e_ordonnance.entities;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String familyName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserType userType;

    // Student-specific fields
    private Integer yearOfStudy; // 1-7, only if userType is STUDENT

    private String specialisation; // only if userType is STUDENT

    @Column(name = "student_card_filename")
    private String studentCardFilename; // filename of uploaded student card

    @Column(name = "verification_status")
    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum UserType {
        STUDENT, DOCTOR, ADMIN
    }

    public enum VerificationStatus {
        PENDING, APPROVED, REJECTED
    }

    // Helper methods for role checking
    public boolean isAdmin() {
        return this.userType == UserType.ADMIN;
    }

    public boolean isNormalUser() {
        return this.userType == UserType.STUDENT || this.userType == UserType.DOCTOR;
    }
}