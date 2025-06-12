package org.sid.e_ordonnance.dtos;

import lombok.Data;

@Data
public class LoginResponseDTO {
    private String token;
    private UserDTO user;
    private String message;
}
