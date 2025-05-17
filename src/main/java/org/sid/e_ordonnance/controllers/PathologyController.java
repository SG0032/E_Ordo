package org.sid.e_ordonnance.controllers;

import org.sid.e_ordonnance.dtos.PathologyDTO;
import org.sid.e_ordonnance.services.PathologyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pathologies")
@CrossOrigin(origins = "http://localhost:4200")
public class PathologyController {

    @Autowired
    private PathologyService pathologyService;

    @GetMapping
    public ResponseEntity<List<PathologyDTO>> getAllPathologies() {
        List<PathologyDTO> pathologies = pathologyService.getAllPathologies();
        return ResponseEntity.ok(pathologies);
    }

    @GetMapping("/search")
    public ResponseEntity<List<PathologyDTO>> searchPathologies(@RequestParam String term) {
        List<PathologyDTO> pathologies = pathologyService.searchPathologies(term);
        return ResponseEntity.ok(pathologies);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getPathologiesCount() {
        Long count = pathologyService.getPathologiesCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PathologyDTO> getPathologyById(@PathVariable Long id) {
        PathologyDTO pathology = pathologyService.getPathologyById(id);
        if (pathology == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pathology);
    }

    @PostMapping
    public ResponseEntity<PathologyDTO> createPathology(@RequestBody PathologyDTO pathologyDTO) {
        PathologyDTO createdPathology = pathologyService.createPathology(pathologyDTO);
        return ResponseEntity.ok(createdPathology);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PathologyDTO> updatePathology(@PathVariable Long id, @RequestBody PathologyDTO pathologyDTO) {
        PathologyDTO updatedPathology = pathologyService.updatePathology(id, pathologyDTO);
        if (updatedPathology == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedPathology);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePathology(@PathVariable Long id) {
        boolean deleted = pathologyService.deletePathology(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}