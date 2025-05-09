package org.sid.e_ordonnance.entities;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Medication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String molecule;
    private String posologie;

    @Column(columnDefinition = "TEXT")
    private String infosMedicament;

    @Column(columnDefinition = "TEXT")
    private String infosMolecule;

    private String manufacturer;

    @ManyToMany(mappedBy = "medications")
    private List<Prescription> prescriptions = new ArrayList<>();
}