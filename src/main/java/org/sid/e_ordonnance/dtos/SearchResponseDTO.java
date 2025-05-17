package org.sid.e_ordonnance.dtos;

import lombok.Data;

import java.util.List;

@Data
public class SearchResponseDTO {
    private PathologyDTO pathology;
    private List<PrescriptionDTO> prescriptions;
    private GuidelineDTO guideline;
}
