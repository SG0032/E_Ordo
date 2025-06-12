package org.sid.e_ordonnance.services;

import jakarta.transaction.Transactional;
import org.sid.e_ordonnance.dtos.*;
import org.sid.e_ordonnance.entities.User;
import org.sid.e_ordonnance.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final String UPLOAD_DIR = "uploads/student-cards/";

    @Transactional
    public ApiResponseDTO register(RegisterRequestDTO registerRequest) {
        // Check if email already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return new ApiResponseDTO(false, "Email already exists");
        }

        // Validate student-specific fields
        if (registerRequest.getUserType() == User.UserType.STUDENT) {
            if (registerRequest.getYearOfStudy() == null ||
                    registerRequest.getYearOfStudy() < 1 ||
                    registerRequest.getYearOfStudy() > 7) {
                return new ApiResponseDTO(false, "Year of study must be between 1 and 7 for students");
            }
            if (registerRequest.getSpecialisation() == null || registerRequest.getSpecialisation().trim().isEmpty()) {
                return new ApiResponseDTO(false, "Specialisation is required for students");
            }
        }

        // Create new user
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setFamilyName(registerRequest.getFamilyName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setUserType(registerRequest.getUserType());

        if (registerRequest.getUserType() == User.UserType.STUDENT) {
            user.setYearOfStudy(registerRequest.getYearOfStudy());
            user.setSpecialisation(registerRequest.getSpecialisation());
            user.setVerificationStatus(User.VerificationStatus.PENDING);
        } else {
            user.setVerificationStatus(User.VerificationStatus.APPROVED); // Doctors are auto-approved
        }

        User savedUser = userRepository.save(user);
        return new ApiResponseDTO(true, "Registration successful", convertToDTO(savedUser));
    }

    public ApiResponseDTO login(LoginRequestDTO loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        if (userOpt.isEmpty()) {
            return new ApiResponseDTO(false, "Invalid email or password");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return new ApiResponseDTO(false, "Invalid email or password");
        }

        // Check if student account is verified
        if (user.getUserType() == User.UserType.STUDENT &&
                user.getVerificationStatus() != User.VerificationStatus.APPROVED) {
            return new ApiResponseDTO(false, "Account pending verification. Please wait for admin approval.");
        }

        // Generate token (simplified - in production use JWT)
        String token = generateToken(user);

        LoginResponseDTO response = new LoginResponseDTO();
        response.setToken(token);
        response.setUser(convertToDTO(user));
        response.setMessage("Login successful");

        return new ApiResponseDTO(true, "Login successful", response);
    }

    @Transactional
    public ApiResponseDTO uploadStudentCard(Long userId, MultipartFile file) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            return new ApiResponseDTO(false, "User not found");
        }

        User user = userOpt.get();

        if (user.getUserType() != User.UserType.STUDENT) {
            return new ApiResponseDTO(false, "Only students can upload student cards");
        }

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);

            // Save file
            Files.copy(file.getInputStream(), filePath);

            // Update user record
            user.setStudentCardFilename(filename);
            user.setVerificationStatus(User.VerificationStatus.PENDING);
            userRepository.save(user);

            return new ApiResponseDTO(true, "Student card uploaded successfully");
        } catch (IOException e) {
            return new ApiResponseDTO(false, "Failed to upload file: " + e.getMessage());
        }
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<UserDTO> getPendingVerifications() {
        return userRepository.findByVerificationStatus(User.VerificationStatus.PENDING)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApiResponseDTO updateVerificationStatus(Long userId, User.VerificationStatus status) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            return new ApiResponseDTO(false, "User not found");
        }

        User user = userOpt.get();
        user.setVerificationStatus(status);
        userRepository.save(user);

        return new ApiResponseDTO(true, "Verification status updated successfully");
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setFamilyName(user.getFamilyName());
        dto.setEmail(user.getEmail());
        dto.setUserType(user.getUserType());
        dto.setYearOfStudy(user.getYearOfStudy());
        dto.setSpecialisation(user.getSpecialisation());
        dto.setStudentCardFilename(user.getStudentCardFilename());
        dto.setVerificationStatus(user.getVerificationStatus());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }

    private String generateToken(User user) {
        // Simplified token generation - in production, use JWT
        return "token_" + user.getId() + "_" + System.currentTimeMillis();
    }
}