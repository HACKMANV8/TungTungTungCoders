package com.casemate.pro.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserResponse user;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor // Add NoArgsConstructor for deserialization
    public static class UserResponse {
        private UUID id;
        private String email;
        private String name;
        private String role;
        private String phone;
        private String address;
        private Integer age;
        private String aboutClient;
    }
}