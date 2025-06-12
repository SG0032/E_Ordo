package org.sid.e_ordonnance.dtos;

import lombok.Data;
import org.sid.e_ordonnance.entities.User;
import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String firstName;
    private String familyName;
    private String email;
    private User.UserType userType;
    private Integer yearOfStudy;
    private String specialisation;
    private String studentCardFilename;
    private User.VerificationStatus verificationStatus;
    private LocalDateTime createdAt;
}

