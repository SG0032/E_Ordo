package org.sid.e_ordonnance.services;
import jakarta.transaction.Transactional;
import org.sid.e_ordonnance.dtos.MedicationDTO;
import org.sid.e_ordonnance.dtos.PrescriptionDTO;
import org.sid.e_ordonnance.entities.Medication;
import org.sid.e_ordonnance.entities.Pathology;
import org.sid.e_ordonnance.entities.Prescription;
import org.sid.e_ordonnance.repositories.MedicationRepository;
import org.sid.e_ordonnance.repositories.PathologyRepository;
import org.sid.e_ordonnance.repositories.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PathologyRepository pathologyRepository;


    public List<PrescriptionDTO> getPrescriptionsByPathologyId(Long pathologyId) {
        List<Prescription> prescriptions = prescriptionRepository.findByPathologyId(pathologyId);
        return prescriptions.stream()
                .map(this::convertToDTO)
                .sorted((p1, p2) -> p1.getName().compareToIgnoreCase(p2.getName()))
                .collect(Collectors.toList());
    }

    /*private PrescriptionDTO convertToDTO(Prescription prescription) {
        PrescriptionDTO dto = new PrescriptionDTO();
        dto.setId(prescription.getId());
        dto.setName(prescription.getName());
        dto.setCourseOfAction(prescription.getCourseOfAction());
        dto.setDosageInstructions(prescription.getDosageInstructions());
        dto.setDuration(prescription.getDuration());
        dto.setPathologyId(prescription.getPathology().getId());
        dto.setPathologyName(prescription.getPathology().getName());

        List<MedicationDTO> medicationDTOs = prescription.getMedications().stream()
                .map(this::convertMedicationToDTO)
                .collect(Collectors.toList());
        dto.setMedications(medicationDTOs);

        return dto;
    }*/

    private MedicationDTO convertMedicationToDTO(Medication medication) {
        MedicationDTO dto = new MedicationDTO();
        dto.setId(medication.getId());
        dto.setName(medication.getName());
        dto.setMolecule(medication.getMolecule());
        dto.setPosologie(medication.getPosologie());
        dto.setInfosMedicament(medication.getInfosMedicament());
        dto.setInfosMolecule(medication.getInfosMolecule());
        dto.setManufacturer(medication.getManufacturer());
        return dto;
    }

    public List<PrescriptionDTO> getAllPrescriptions() {
        List<Prescription> prescriptions = prescriptionRepository.findAll();
        return prescriptions.stream()
                .map(this::convertToDTO)
                .sorted((p1, p2) -> p1.getName().compareToIgnoreCase(p2.getName()))
                .collect(Collectors.toList());
    }

    public Long getPrescriptionsCount() {
        return prescriptionRepository.count();
    }

    public PrescriptionDTO getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    @Transactional
    public PrescriptionDTO createPrescription(PrescriptionDTO prescriptionDTO) {
        Prescription prescription = convertToEntity(prescriptionDTO);
        Prescription savedPrescription = prescriptionRepository.save(prescription);
        return convertToDTO(savedPrescription);
    }

    @Transactional
    public PrescriptionDTO updatePrescription(Long id, PrescriptionDTO prescriptionDTO) {
        return prescriptionRepository.findById(id)
                .map(prescription -> {
                    updatePrescriptionFields(prescription, prescriptionDTO);
                    Prescription updatedPrescription = prescriptionRepository.save(prescription);
                    return convertToDTO(updatedPrescription);
                })
                .orElse(null);
    }

    @Transactional
    public boolean deletePrescription(Long id) {
        if (prescriptionRepository.existsById(id)) {
            prescriptionRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private void updatePrescriptionFields(Prescription prescription, PrescriptionDTO prescriptionDTO) {
        prescription.setName(prescriptionDTO.getName());
        prescription.setCourseOfAction(prescriptionDTO.getCourseOfAction());
        prescription.setDosageInstructions(prescriptionDTO.getDosageInstructions());
        prescription.setDuration(prescriptionDTO.getDuration());

        // Update pathology
        Pathology pathology = pathologyRepository.findById(prescriptionDTO.getPathologyId())
                .orElseThrow(() -> new IllegalArgumentException("Pathology not found with id: " + prescriptionDTO.getPathologyId()));
        prescription.setPathology(pathology);

        // Update medications
        Set<Medication> medications = new HashSet<>();
        /*if (prescriptionDTO.getMedicationIds() != null && !prescriptionDTO.getMedicationIds().isEmpty()) {
            prescriptionDTO.getMedicationIds().forEach(medicationId -> {
                Medication medication = medicationRepository.findById(medicationId)
                        .orElseThrow(() -> new IllegalArgumentException("Medication not found with id: " + medicationId));
                medications.add(medication);
            });
        }*/

        // Clear existing medications and add new ones
        prescription.getMedications().clear();
        prescription.getMedications().addAll(medications);
    }

    private PrescriptionDTO convertToDTO(Prescription prescription) {
        PrescriptionDTO dto = new PrescriptionDTO();
        dto.setId(prescription.getId());
        dto.setName(prescription.getName());
        dto.setCourseOfAction(prescription.getCourseOfAction());
        dto.setDosageInstructions(prescription.getDosageInstructions());
        dto.setDuration(prescription.getDuration());

        // Set pathology details
        dto.setPathologyId(prescription.getPathology().getId());
        dto.setPathologyName(prescription.getPathology().getName());

        // Set medications
        List<MedicationDTO> medicationDTOs = prescription.getMedications().stream()
                .map(this::convertMedicationToDTO)
                .collect(Collectors.toList());
        dto.setMedications(medicationDTOs);

        return dto;
    }

    private Prescription convertToEntity(PrescriptionDTO prescriptionDTO) {
        Prescription prescription = new Prescription();
        if (prescriptionDTO.getId() != null) {
            prescription.setId(prescriptionDTO.getId());
        }

        prescription.setName(prescriptionDTO.getName());
        prescription.setCourseOfAction(prescriptionDTO.getCourseOfAction());
        prescription.setDosageInstructions(prescriptionDTO.getDosageInstructions());
        prescription.setDuration(prescriptionDTO.getDuration());

        // Set pathology
        Pathology pathology = pathologyRepository.findById(prescriptionDTO.getPathologyId())
                .orElseThrow(() -> new IllegalArgumentException("Pathology not found with id: " + prescriptionDTO.getPathologyId()));
        prescription.setPathology(pathology);

        // Set medications
       /* if (prescriptionDTO.getMedicationId() != null && !prescriptionDTO.getMedicationIds().isEmpty()) {
            Set<Medication> medications = new HashSet<>();
            prescriptionDTO.getMedicationIds().forEach(medicationId -> {
                Medication medication = medicationRepository.findById(medicationId)
                        .orElseThrow(() -> new IllegalArgumentException("Medication not found with id: " + medicationId));
                medications.add(medication);
            });
            prescription.setMedications(medications);
        }*/

        return prescription;
    }

}