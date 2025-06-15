package org.sid.e_ordonnance.dtos;

import lombok.Data;
import org.sid.e_ordonnance.entities.User;

@Data
public class RegisterRequestDTO {
    private String firstName;
    private String familyName;
    private String email;
    private String password;
    private User.UserType userType;
    private Integer yearOfStudy; // Optional, only for students
    private String specialisation; // Optional, only for students
    // Note: student card will be uploaded separately via file upload endpoint
}
