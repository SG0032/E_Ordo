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

        // Set verification status based on user type
        switch (registerRequest.getUserType()) {
            case STUDENT:
                user.setYearOfStudy(registerRequest.getYearOfStudy());
                user.setSpecialisation(registerRequest.getSpecialisation());
                user.setVerificationStatus(User.VerificationStatus.PENDING);
                break;
            case DOCTOR:
                user.setVerificationStatus(User.VerificationStatus.APPROVED); // Doctors are auto-approved
                break;
            case ADMIN:
                user.setVerificationStatus(User.VerificationStatus.APPROVED); // Admins are auto-approved
                break;
            default:
                user.setVerificationStatus(User.VerificationStatus.PENDING);
        }

        User savedUser = userRepository.save(user);

        String message = getRegistrationMessage(savedUser.getUserType());
        return new ApiResponseDTO(true, message, convertToDTO(savedUser));
    }

    private String getRegistrationMessage(User.UserType userType) {
        switch (userType) {
            case STUDENT:
                return "Registration successful! Please upload your student card for verification.";
            case DOCTOR:
                return "Registration successful! Your account has been approved and you can now log in.";
            case ADMIN:
                return "Administrator account created successfully! You now have full system access.";
            default:
                return "Registration successful!";
        }
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

        // Check verification status based on user type
        switch (user.getUserType()) {
            case STUDENT:
                if (user.getVerificationStatus() != User.VerificationStatus.APPROVED) {
                    return new ApiResponseDTO(false, "Student account pending verification. Please wait for admin approval.");
                }
                break;
            case DOCTOR:
            case ADMIN:
                // Doctors and Admins are auto-approved, but double-check
                if (user.getVerificationStatus() != User.VerificationStatus.APPROVED) {
                    user.setVerificationStatus(User.VerificationStatus.APPROVED);
                    userRepository.save(user);
                }
                break;
        }

        // Generate token (simplified - in production use JWT)
        String token = generateToken(user);

        LoginResponseDTO response = new LoginResponseDTO();
        response.setToken(token);
        response.setUser(convertToDTO(user));
        response.setMessage(getLoginMessage(user.getUserType()));

        return new ApiResponseDTO(true, "Login successful", response);
    }

    private String getLoginMessage(User.UserType userType) {
        switch (userType) {
            case ADMIN:
                return "Welcome back, Administrator! You have full system access.";
            case DOCTOR:
                return "Welcome back, Doctor!";
            case STUDENT:
                return "Welcome back, Futur Doctor!";
            default:
                return "Login successful";
        }
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

            return new ApiResponseDTO(true, "Student card uploaded successfully. Please wait for verification.");
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

        // Prevent changing admin verification status
        if (user.getUserType() == User.UserType.ADMIN && status != User.VerificationStatus.APPROVED) {
            return new ApiResponseDTO(false, "Administrator accounts cannot be rejected or set to pending");
        }

        user.setVerificationStatus(status);
        userRepository.save(user);

        String message = String.format("User verification status updated to %s", status.toString().toLowerCase());
        return new ApiResponseDTO(true, message);
    }

    // Helper method to check if user has admin privileges
    public boolean hasAdminPrivileges(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        return userOpt.isPresent() && userOpt.get().getUserType() == User.UserType.ADMIN;
    }

    // Method to get users by role
    public List<UserDTO> getUsersByRole(User.UserType userType) {
        return userRepository.findByUserType(userType)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Get statistics for admin dashboard
    public AdminStatsDTO getAdminStatistics() {
        AdminStatsDTO stats = new AdminStatsDTO();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalStudents((long) userRepository.findByUserType(User.UserType.STUDENT).size());
        stats.setTotalDoctors((long) userRepository.findByUserType(User.UserType.DOCTOR).size());
        stats.setTotalAdmins((long) userRepository.findByUserType(User.UserType.ADMIN).size());
        stats.setPendingVerifications((long) userRepository.findByVerificationStatus(User.VerificationStatus.PENDING).size());
        return stats;
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
        // Simplified token generation - in production, use JWT with role information
        return "token_" + user.getId() + "_" + user.getUserType() + "_" + System.currentTimeMillis();
    }
}