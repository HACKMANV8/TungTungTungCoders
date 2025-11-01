package com.casemate.pro.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaseResponse {
    private UUID id;
    private String caseNumber;
    private String title;
    private String description;
    private String status;
    private UserInfo client;
    private UserInfo lawyer;
    private Double caseValue;
    private LocalDateTime nextHearing;
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private String id;
        private String name;
    }
}
