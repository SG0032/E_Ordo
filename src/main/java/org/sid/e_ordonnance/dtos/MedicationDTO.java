package org.sid.e_ordonnance.dtos;
import lombok.Data;

@Data
public class MedicationDTO {
    private Integer id;
    private String name;
    private String molecule;
    private String posologie;
    private String infosMedicament;
    private String infosMolecule;
    private String manufacturer;
}