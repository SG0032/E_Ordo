package org.sid.e_ordonnance.controllers;


import org.sid.e_ordonnance.dtos.MedicationDTO;
import org.sid.e_ordonnance.services.MedicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medications")
@CrossOrigin(origins = "http://localhost:4200")
public class MedicationController {

    @Autowired
    private MedicationService medicationService;

    @GetMapping
    public ResponseEntity<List<MedicationDTO>> getAllMedications() {
        List<MedicationDTO> medications = medicationService.getAllMedications();
        return ResponseEntity.ok(medications);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getMedicationsCount() {
        Long count = medicationService.getMedicationsCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicationDTO> getMedicationById(@PathVariable Integer id) {
        MedicationDTO medication = medicationService.getMedicationById(id);
        if (medication == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(medication);
    }

    @PostMapping
    public ResponseEntity<MedicationDTO> createMedication(@RequestBody MedicationDTO medicationDTO) {
        MedicationDTO createdMedication = medicationService.createMedication(medicationDTO);
        return ResponseEntity.ok(createdMedication);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicationDTO> updateMedication(@PathVariable Integer id, @RequestBody MedicationDTO medicationDTO) {
        MedicationDTO updatedMedication = medicationService.updateMedication(id, medicationDTO);
        if (updatedMedication == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedMedication);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedication(@PathVariable Integer id) {
        boolean deleted = medicationService.deleteMedication(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}