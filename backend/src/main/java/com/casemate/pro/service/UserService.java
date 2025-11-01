package com.casemate.pro.service;

import com.casemate.pro.controller.UserController;
import com.casemate.pro.entity.User;
import com.casemate.pro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User updateUserProfile(UUID userId, String authenticatedEmail, UserController.UpdateProfileRequest request) {
        // Find the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify that the authenticated user is the same as the user being updated
        if (!user.getEmail().equals(authenticatedEmail)) {
            throw new RuntimeException("Unauthorized: You can only update your own profile");
        }

        // Check if email is being changed and if it's already taken
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email is already taken");
            }
            user.setEmail(request.getEmail());
        }

        // Update user fields
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getAge() != null) {
            user.setAge(request.getAge());
        }
        if (request.getAboutClient() != null) {
            user.setAboutClient(request.getAboutClient());
        }

        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(UUID userId, String authenticatedEmail, UserController.ChangePasswordRequest request) {
        // Find the user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify that the authenticated user is the same as the user being updated
        if (!user.getEmail().equals(authenticatedEmail)) {
            throw new RuntimeException("Unauthorized: You can only change your own password");
        }

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect");
        }

        // Validate new password
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters long");
        }

        // Update password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public User getUserById(UUID userId, String authenticatedEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify that the authenticated user is the same as the user being retrieved
        if (!user.getEmail().equals(authenticatedEmail)) {
            throw new RuntimeException("Unauthorized: You can only view your own profile");
        }

        return user;
    }
}
