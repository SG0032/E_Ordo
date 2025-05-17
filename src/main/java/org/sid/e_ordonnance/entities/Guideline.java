package org.sid.e_ordonnance.entities;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Guideline {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String source;
    private String lastUpdated;

    @OneToOne
    @JoinColumn(name = "pathology_id")
    private Pathology pathology;
}
