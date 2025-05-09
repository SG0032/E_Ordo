package org.sid.e_ordonnance.services;

import jakarta.transaction.Transactional;
import org.sid.e_ordonnance.dtos.MedicationDTO;
import org.sid.e_ordonnance.entities.Medication;
import org.sid.e_ordonnance.repositories.MedicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicationService {

    @Autowired
    private MedicationRepository medicationRepository;

    public List<MedicationDTO> getAllMedications() {
        List<Medication> medications = medicationRepository.findAll();
        return medications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Long getMedicationsCount() {
        return medicationRepository.count();
    }

    public MedicationDTO getMedicationById(Integer id) {
        return medicationRepository.findById(Long.valueOf(id))
                .map(this::convertToDTO)
                .orElse(null);
    }

    @Transactional
    public MedicationDTO createMedication(MedicationDTO medicationDTO) {
        Medication medication = convertToEntity(medicationDTO);
        Medication savedMedication = medicationRepository.save(medication);
        return convertToDTO(savedMedication);
    }
    @Transactional
    public MedicationDTO updateMedication(Integer id, MedicationDTO medicationDTO) {
        return medicationRepository.findById(Long.valueOf(id))
                .map(medication -> {
                    updateMedicationFields(medication, medicationDTO);
                    Medication updatedMedication = medicationRepository.save(medication);
                    return convertToDTO(updatedMedication);
                })
                .orElse(null);
    }

    @Transactional
    public boolean deleteMedication(Integer id) {
        if (medicationRepository.existsById(Long.valueOf(id))) {
            medicationRepository.deleteById(Long.valueOf(id));
            return true;
        }
        return false;
    }

    private void updateMedicationFields(Medication medication, MedicationDTO medicationDTO) {
        medication.setName(medicationDTO.getName());
        medication.setMolecule(medicationDTO.getMolecule());
        medication.setPosologie(medicationDTO.getPosologie());
        medication.setInfosMedicament(medicationDTO.getInfosMedicament());
        medication.setInfosMolecule(medicationDTO.getInfosMolecule());
        medication.setManufacturer(medicationDTO.getManufacturer());
    }

    private MedicationDTO convertToDTO(Medication medication) {
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

    private Medication convertToEntity(MedicationDTO medicationDTO) {
        Medication medication = new Medication();
        medication.setName(medicationDTO.getName());
        medication.setMolecule(medicationDTO.getMolecule());
        medication.setPosologie(medicationDTO.getPosologie());
        medication.setInfosMedicament(medicationDTO.getInfosMedicament());
        medication.setInfosMolecule(medicationDTO.getInfosMolecule());
        medication.setManufacturer(medicationDTO.getManufacturer());
        return medication;
    }
}