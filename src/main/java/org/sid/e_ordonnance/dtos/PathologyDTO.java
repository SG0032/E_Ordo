package org.sid.e_ordonnance.dtos;
import lombok.Data;

@Data
public class PathologyDTO {
    private Long id;
    private String name;
    private String description;
    private String icdCode;
    private boolean hasGuidelines;
}