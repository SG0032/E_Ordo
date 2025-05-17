package org.sid.e_ordonnance.dtos;

import lombok.Data;
import java.util.List;

@Data
public class PrescriptionDTO {
    private Long id;
    private String name;
    private String courseOfAction;
    private String dosageInstructions;
    private String duration;
    private Long pathologyId;
    private String pathologyName;
    private List<MedicationDTO> medications;
}