package org.sid.e_ordonnance.controllers;

import org.sid.e_ordonnance.dtos.*;
import org.sid.e_ordonnance.entities.User;
import org.sid.e_ordonnance.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponseDTO> register(@RequestBody RegisterRequestDTO registerRequest) {
        ApiResponseDTO response = authService.register(registerRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        ApiResponseDTO response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload-student-card/{userId}")
    public ResponseEntity<ApiResponseDTO> uploadStudentCard(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {

        // Validate file
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponseDTO(false, "Please select a file to upload"));
        }

        // Check file type (accept images and PDFs)
        String contentType = file.getContentType();
        if (contentType == null ||
                (!contentType.startsWith("image/") && !contentType.equals("application/pdf"))) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponseDTO(false, "Only image files and PDFs are allowed"));
        }

        // Check file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponseDTO(false, "File size must be less than 5MB"));
        }

        ApiResponseDTO response = authService.uploadStudentCard(userId, file);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = authService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/pending-verifications")
    public ResponseEntity<List<UserDTO>> getPendingVerifications() {
        List<UserDTO> pendingUsers = authService.getPendingVerifications();
        return ResponseEntity.ok(pendingUsers);
    }

    @PutMapping("/verify-user/{userId}")
    public ResponseEntity<ApiResponseDTO> updateVerificationStatus(
            @PathVariable Long userId,
            @RequestParam User.VerificationStatus status) {
        ApiResponseDTO response = authService.updateVerificationStatus(userId, status);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/specialisations")
    public ResponseEntity<List<String>> getSpecialisations() {
        // Return list of available specialisations
        List<String> specialisations = List.of(
                "General Medicine",
                "Cardiology",
                "Neurology",
                "Pediatrics",
                "Surgery",
                "Psychiatry",
                "Dermatology",
                "Orthopedics",
                "Radiology",
                "Anesthesiology",
                "Emergency Medicine",
                "Internal Medicine"
        );
        return ResponseEntity.ok(specialisations);
    }
}