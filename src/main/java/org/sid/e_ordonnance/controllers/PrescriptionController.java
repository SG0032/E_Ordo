package org.sid.e_ordonnance.controllers;

import org.sid.e_ordonnance.dtos.PrescriptionDTO;
import org.sid.e_ordonnance.services.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "http://localhost:4200")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @GetMapping("/pathology/{pathologyId}")
    public ResponseEntity<List<PrescriptionDTO>> getPrescriptionsByPathologyId(@PathVariable Long pathologyId) {
        List<PrescriptionDTO> prescriptions = prescriptionService.getPrescriptionsByPathologyId(pathologyId);
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping
    public ResponseEntity<List<PrescriptionDTO>> getAllPrescriptions() {
        List<PrescriptionDTO> prescriptions = prescriptionService.getAllPrescriptions();
        return ResponseEntity.ok(prescriptions);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getPrescriptionsCount() {
        Long count = prescriptionService.getPrescriptionsCount();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PrescriptionDTO> getPrescriptionById(@PathVariable Long id) {
        PrescriptionDTO prescription = prescriptionService.getPrescriptionById(id);
        if (prescription == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(prescription);
    }

    @PostMapping
    public ResponseEntity<PrescriptionDTO> createPrescription(@RequestBody PrescriptionDTO prescriptionDTO) {
        PrescriptionDTO createdPrescription = prescriptionService.createPrescription(prescriptionDTO);
        return ResponseEntity.ok(createdPrescription);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrescriptionDTO> updatePrescription(@PathVariable Long id, @RequestBody PrescriptionDTO prescriptionDTO) {
        PrescriptionDTO updatedPrescription = prescriptionService.updatePrescription(id, prescriptionDTO);
        if (updatedPrescription == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedPrescription);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id) {
        boolean deleted = prescriptionService.deletePrescription(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}