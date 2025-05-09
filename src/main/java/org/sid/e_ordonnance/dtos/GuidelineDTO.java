package org.sid.e_ordonnance.dtos;

import lombok.Data;

@Data
public class GuidelineDTO {
    private Long id;
    private String title;
    private String content;
    private String source;
    private String lastUpdated;
    private Long pathologyId;
}