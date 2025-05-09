package org.sid.e_ordonnance.entities;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class Pathology {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    //We can remove the description
    private String description;
    private String icdCode; // International Classification of Diseases code

    @OneToMany(mappedBy = "pathology", cascade = CascadeType.ALL)
    private List<Prescription> prescriptions = new ArrayList<>();

    @OneToOne(mappedBy = "pathology", cascade = CascadeType.ALL)
    private Guideline guideline;
}
