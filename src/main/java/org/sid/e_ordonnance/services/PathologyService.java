package org.sid.e_ordonnance.services;

import jakarta.transaction.Transactional;
import org.sid.e_ordonnance.dtos.PathologyDTO;
import org.sid.e_ordonnance.entities.Pathology;
import org.sid.e_ordonnance.repositories.PathologyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PathologyService {

    @Autowired
    private PathologyRepository pathologyRepository;

    public List<PathologyDTO> getAllPathologies() {
        List<Pathology> pathologies = pathologyRepository.findAll();
        return pathologies.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PathologyDTO> searchPathologies(String term) {
        List<Pathology> pathologies = pathologyRepository.findByNameContainingIgnoreCase(term);
        return pathologies.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    public Long getPathologiesCount() {
        return pathologyRepository.count();
    }

    public PathologyDTO getPathologyById(Long id) {
        return pathologyRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    @Transactional
    public PathologyDTO createPathology(PathologyDTO pathologyDTO) {
        Pathology pathology = convertToEntity(pathologyDTO);
        Pathology savedPathology = pathologyRepository.save(pathology);
        return convertToDTO(savedPathology);
    }

    @Transactional
    public PathologyDTO updatePathology(Long id, PathologyDTO pathologyDTO) {
        return pathologyRepository.findById(id)
                .map(pathology -> {
                    updatePathologyFields(pathology, pathologyDTO);
                    Pathology updatedPathology = pathologyRepository.save(pathology);
                    return convertToDTO(updatedPathology);
                })
                .orElse(null);
    }

    @Transactional
    public boolean deletePathology(Long id) {
        if (pathologyRepository.existsById(id)) {
            pathologyRepository.deleteById(id);
            return true;
        }
        return false;
    }

    private void updatePathologyFields(Pathology pathology, PathologyDTO pathologyDTO) {
        pathology.setName(pathologyDTO.getName());
        pathology.setDescription(pathologyDTO.getDescription());
        pathology.setIcdCode(pathologyDTO.getIcdCode());
    }

    private PathologyDTO convertToDTO(Pathology pathology) {
        PathologyDTO dto = new PathologyDTO();
        dto.setId(pathology.getId());
        dto.setName(pathology.getName());
        dto.setDescription(pathology.getDescription());
        dto.setIcdCode(pathology.getIcdCode());
        return dto;
    }

    private Pathology convertToEntity(PathologyDTO pathologyDTO) {
        Pathology pathology = new Pathology();
        pathology.setName(pathologyDTO.getName());
        pathology.setDescription(pathologyDTO.getDescription());
        pathology.setIcdCode(pathologyDTO.getIcdCode());
        return pathology;
    }
}
