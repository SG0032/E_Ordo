package org.sid.e_ordonnance.services;

import org.sid.e_ordonnance.dtos.GuidelineDTO;
import org.sid.e_ordonnance.dtos.PathologyDTO;
import org.sid.e_ordonnance.dtos.PrescriptionDTO;
import org.sid.e_ordonnance.dtos.SearchResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    @Autowired
    private PathologyService pathologyService;

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private GuidelineService guidelineService;

    public SearchResponseDTO searchByPathologyId(Long pathologyId) {
        SearchResponseDTO response = new SearchResponseDTO();

        // Get pathology information
        PathologyDTO pathology = pathologyService.getPathologyById(pathologyId);
        if (pathology == null) {
            return null;
        }
        response.setPathology(pathology);

        // Get associated prescriptions
        List<PrescriptionDTO> prescriptions = prescriptionService.getPrescriptionsByPathologyId(pathologyId);
        response.setPrescriptions(prescriptions);

        // Get guideline if available
        GuidelineDTO guideline = guidelineService.getGuidelineByPathologyId(pathologyId);
        response.setGuideline(guideline);

        return response;
    }
}