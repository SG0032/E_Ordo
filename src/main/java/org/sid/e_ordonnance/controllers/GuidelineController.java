package org.sid.e_ordonnance.controllers;

import org.sid.e_ordonnance.dtos.GuidelineDTO;
import org.sid.e_ordonnance.services.GuidelineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guidelines")
@CrossOrigin(origins = "http://localhost:4200")
public class GuidelineController {

    @Autowired
    private GuidelineService guidelineService;

    @GetMapping("/pathology/{pathologyId}")
    public ResponseEntity<GuidelineDTO> getGuidelineByPathologyId(@PathVariable Long pathologyId) {
        GuidelineDTO guideline = guidelineService.getGuidelineByPathologyId(pathologyId);
        if (guideline == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(guideline);
    }

    @GetMapping
    public ResponseEntity<List<GuidelineDTO>> getAllGuidelines() {
        List<GuidelineDTO> guidelines = guidelineService.getAllGuidelines();
        return ResponseEntity.ok(guidelines);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getGuidelinesCount() {
        Long count = guidelineService.getGuidelinesCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{id}")
    public ResponseEntity<GuidelineDTO> getGuidelineById(@PathVariable Long id) {
        GuidelineDTO guideline = guidelineService.getGuidelineById(id);
        if (guideline == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(guideline);
    }

    @PostMapping
    public ResponseEntity<GuidelineDTO> createGuideline(@RequestBody GuidelineDTO guidelineDTO) {
        GuidelineDTO createdGuideline = guidelineService.createGuideline(guidelineDTO);
        return ResponseEntity.ok(createdGuideline);
    }

  /*  @PutMapping("/{id}")
    public ResponseEntity<GuidelineDTO> updateGuideline(@PathVariable Long id, @RequestBody GuidelineDTO guidelineDTO) {
        GuidelineDTO updatedGuideline = guidelineService.updateGuideline(id, guidelineDTO);
        if (updatedGuideline == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedGuideline);
    }
*/
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGuideline(@PathVariable Long id) {
        boolean deleted = guidelineService.deleteGuideline(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
