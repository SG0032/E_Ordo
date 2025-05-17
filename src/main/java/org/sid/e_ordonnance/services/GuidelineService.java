package org.sid.e_ordonnance.services;

import jakarta.transaction.Transactional;
import org.sid.e_ordonnance.dtos.GuidelineDTO;
import org.sid.e_ordonnance.entities.Guideline;
import org.sid.e_ordonnance.repositories.GuidelineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GuidelineService {

    @Autowired
    private GuidelineRepository guidelineRepository;

    public GuidelineDTO getGuidelineByPathologyId(Long pathologyId) {
        Optional<Guideline> guidelineOpt = guidelineRepository.findByPathologyId(pathologyId);
        return guidelineOpt.map(this::convertToDTO).orElse(null);
    }

    public List<GuidelineDTO> getAllGuidelines() {
        List<Guideline> guidelines = guidelineRepository.findAll();
        return guidelines.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Long getGuidelinesCount() {
        return guidelineRepository.count();
    }

    public GuidelineDTO getGuidelineById(Long id) {
        return guidelineRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    public List<GuidelineDTO> getGuidelinesByPathology(Long pathologyId) {
        Optional<Guideline> guidelines = guidelineRepository.findByPathologyId(pathologyId);
        return guidelines.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public GuidelineDTO createGuideline(GuidelineDTO guidelineDTO) {
        Guideline guideline = convertToEntity(guidelineDTO);
        Guideline savedGuideline = guidelineRepository.save(guideline);
        return convertToDTO(savedGuideline);
    }
    private Guideline convertToEntity(GuidelineDTO guidelineDTO) {
        Guideline guideline = new Guideline();
        if (guidelineDTO.getId() != null) {
            guideline.setId(guidelineDTO.getId());
        }

        guideline.setTitle(guidelineDTO.getTitle());
        guideline.setContent(guidelineDTO.getContent());
        //guideline.setSummary(guidelineDTO.getSummary());
        guideline.setSource(guidelineDTO.getSource());
        //guideline.setUrl(guidelineDTO.getUrl());
        //guideline.setPublishDate(guidelineDTO.getPublishDate());

        // Set pathology
   /*     Pathology pathology = pathologyRepository.findById(guidelineDTO.getPathologyId())
                .orElseThrow(() -> new IllegalArgumentException("Pathology not found with id: " + guidelineDTO.getPathologyId()));
        guideline.setPathology(pathology);
*/
        return guideline;
    }
/*    @Transactional
    public GuidelineDTO updateGuideline(Long id, GuidelineDTO guidelineDTO) {
        return guidelineRepository.findById(id)
                .map(guideline -> {
                    updateGuidelineFields(guideline, guidelineDTO);
                    Guideline updatedGuideline = guidelineRepository.save(guideline);
                    return convertToDTO(updatedGuideline);
                })
                .orElse(null);
    }*/

    @Transactional
    public boolean deleteGuideline(Long id) {
        if (guidelineRepository.existsById(id)) {
            guidelineRepository.deleteById(id);
            return true;
        }
        return false;
    }

/*    private void updateGuidelineFields(Guideline guideline, GuidelineDTO guidelineDTO) {
        guideline.setTitle(guidelineDTO.getTitle());
        guideline.setContent(guidelineDTO.getContent());
        guideline.setSummary(guidelineDTO.getSummary());
        guideline.setSource(guidelineDTO.getSource());
        guideline.setUrl(guidelineDTO.getUrl());
        guideline.setPublishDate(guidelineDTO.getPublishDate());

        // Update pathology if changed
        if (!guideline.getPathology().getId().equals(guidelineDTO.getPathologyId())) {
            Pathology pathology = pathologyRepository.findById(guidelineDTO.getPathologyId())
                    .orElseThrow(() -> new IllegalArgumentException("Pathology not found with id: " + guidelineDTO.getPathologyId()));
            guideline.setPathology(pathology);
        }
    }
    */

    private GuidelineDTO convertToDTO(Guideline guideline) {
        GuidelineDTO dto = new GuidelineDTO();
        dto.setId(guideline.getId());
        dto.setTitle(guideline.getTitle());
        dto.setContent(guideline.getContent());
        dto.setSource(guideline.getSource());
        dto.setLastUpdated(guideline.getLastUpdated());
        dto.setPathologyId(guideline.getPathology().getId());
        return dto;
    }
}