package com.casemate.pro.controller;

import com.casemate.pro.dto.AuthResponse;
import com.casemate.pro.entity.User;
import com.casemate.pro.service.UserService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication) {
        
        try {
            // Get the authenticated user's email
            String authenticatedEmail = authentication.getName();
            
            // Update the user profile
            User updatedUser = userService.updateUserProfile(id, authenticatedEmail, request);
            
            // Return updated user data
            AuthResponse.UserResponse userResponse = new AuthResponse.UserResponse(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getName(),
                updatedUser.getRole().name(),
                updatedUser.getPhone(),
                updatedUser.getAddress(),
                updatedUser.getAge(),
                updatedUser.getAboutClient()
            );
            
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(
            @PathVariable UUID id,
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {
        
        try {
            // Get the authenticated user's email
            String authenticatedEmail = authentication.getName();
            
            // Change the password
            userService.changePassword(id, authenticatedEmail, request);
            
            return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(
            @PathVariable UUID id,
            Authentication authentication) {
        
        try {
            String authenticatedEmail = authentication.getName();
            User user = userService.getUserById(id, authenticatedEmail);
            
            AuthResponse.UserResponse userResponse = new AuthResponse.UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole().name(),
                user.getPhone(),
                user.getAddress(),
                user.getAge(),
                user.getAboutClient()
            );
            
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @Data
    public static class UpdateProfileRequest {
        private String name;
        private String email;
        private String phone;
        private String address;
        private Integer age;
        private String aboutClient;
    }

    @Data
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;
    }

    @Data
    @lombok.AllArgsConstructor
    public static class MessageResponse {
        private String message;
    }

    @Data
    @lombok.AllArgsConstructor
    public static class ErrorResponse {
        private String message;
    }
}
