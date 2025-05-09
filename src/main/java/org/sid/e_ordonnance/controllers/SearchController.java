package org.sid.e_ordonnance.controllers;

import org.sid.e_ordonnance.dtos.SearchResponseDTO;
import org.sid.e_ordonnance.services.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:4200")
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping("/pathology/{pathologyId}")
    public ResponseEntity<SearchResponseDTO> searchByPathologyId(@PathVariable Long pathologyId) {
        SearchResponseDTO result = searchService.searchByPathologyId(pathologyId);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }
}
