package org.sid.e_ordonnance.dtos;

import lombok.Data;

@Data
public class ApiResponseDTO {
    private boolean success;
    private String message;
    private Object data;

    public ApiResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public ApiResponseDTO(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}
