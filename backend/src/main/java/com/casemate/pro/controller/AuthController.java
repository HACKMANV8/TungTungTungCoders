package com.casemate.pro.controller;

import com.casemate.pro.dto.AuthResponse;
import com.casemate.pro.dto.LoginRequest;
import com.casemate.pro.dto.ProfileUpdateRequest;
import com.casemate.pro.dto.RegisterRequest;
import com.casemate.pro.entity.User;
import com.casemate.pro.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse.UserResponse> getCurrentUser() {
        try {
            User user = authService.getCurrentUser();
            AuthResponse.UserResponse userResponse = new AuthResponse.UserResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole().name().toLowerCase(),
                user.getPhone(),
                user.getAddress(),
                user.getAge(),
                user.getAboutClient()
            );
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Object> updateUserProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        try {
            User currentUser = authService.getCurrentUser();
            User updatedUser = authService.updateUserProfile(currentUser.getId(), request.getAge(), request.getAboutClient());
            
            AuthResponse.UserResponse userResponse = new AuthResponse.UserResponse(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getName(),
                updatedUser.getRole().name().toLowerCase(),
                updatedUser.getPhone(),
                updatedUser.getAddress(),
                updatedUser.getAge(),
                updatedUser.getAboutClient()
            );

            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            System.err.println("Error updating user profile: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
