package com.casemate.pro.controller;

import com.casemate.pro.dto.CaseResponse;
import com.casemate.pro.entity.Case;
import com.casemate.pro.entity.User;
import com.casemate.pro.service.AuthService;
import com.casemate.pro.service.CaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/cases")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CaseController {

    private final CaseService caseService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCases(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "recent") String sort) {
        try {
            User currentUser = authService.getCurrentUser();
            Page<Case> casePage;

            if (currentUser.getRole() == User.Role.LAWYER) {
                casePage = caseService.getCasesByLawyer(currentUser, page, size, status, sort);
            } else {
                casePage = caseService.getCasesByClient(currentUser, page, size);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("cases", casePage.getContent());
            response.put("total", casePage.getTotalElements());
            response.put("limit", size);
            response.put("offset", page * size);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error fetching cases: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getCaseById(@PathVariable UUID id) {
        try {
            User currentUser = authService.getCurrentUser();
            Case caseEntity = caseService.getCaseById(id, currentUser);
            CaseResponse response = convertToCaseResponse(caseEntity);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error fetching case by ID: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<Object> createCase(@RequestBody Map<String, Object> caseRequest) {
        try {
            User currentUser = authService.getCurrentUser();

            // Extract case data from request
            String title = (String) caseRequest.get("title");
            String description = (String) caseRequest.get("description");
            String nextHearing = (String) caseRequest.get("nextHearing");
            Object caseValueObj = caseRequest.get("caseValue");

            System.out.println("DEBUG: Creating case with caseValue: " + caseValueObj);

            // Extract lawyer information
            Map<String, Object> lawyerMap = (Map<String, Object>) caseRequest.get("lawyer");
            String lawyerId = (String) lawyerMap.get("id");

            Case caseData = new Case();
            caseData.setTitle(title);
            caseData.setDescription(description);
            if (nextHearing != null && !nextHearing.isEmpty()) {
                caseData.setNextHearing(java.time.LocalDateTime.parse(nextHearing));
            }
            if (caseValueObj != null) {
                try {
                    Double caseValue = ((Number) caseValueObj).doubleValue();
                    caseData.setCaseValue(caseValue);
                    System.out.println("DEBUG: Set caseValue to: " + caseValue);
                } catch (Exception e) {
                    System.err.println("Error parsing caseValue: " + e.getMessage());
                }
            } else {
                System.out.println("DEBUG: caseValue is null");
            }

            User lawyer = new User();
            lawyer.setId(UUID.fromString(lawyerId));

            Case newCase = caseService.createCase(caseData, currentUser, lawyer);
            return ResponseEntity.ok(newCase);
        } catch (Exception e) {
            System.err.println("Error creating case: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<Object> updateCase(@PathVariable UUID id, @RequestBody Case updateData) {
        try {
            User currentUser = authService.getCurrentUser();
            Case updatedCase = caseService.updateCase(id, updateData, currentUser);
            return ResponseEntity.ok(updatedCase);
        } catch (Exception e) {
            System.err.println("Error updating case: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<Object> updateCaseStatus(@PathVariable UUID id, @RequestBody Map<String, String> statusRequest) {
        try {
            User currentUser = authService.getCurrentUser();
            Case.Status newStatus = Case.Status.valueOf(statusRequest.get("status").toUpperCase());
            Case updatedCase = caseService.updateCaseStatus(id, newStatus, currentUser);
            return ResponseEntity.ok(updatedCase);
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid status provided: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid case status provided."));
        } catch (RuntimeException e) {
            System.err.println("Runtime error updating case status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error updating case status: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An unexpected error occurred while updating case status."));
        }
    }

    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<Object> acceptCase(@PathVariable UUID id) {
        try {
            User currentUser = authService.getCurrentUser();
            Case updatedCase = caseService.updateCaseStatus(id, Case.Status.ACTIVE, currentUser);
            return ResponseEntity.ok(updatedCase);
        } catch (RuntimeException e) {
            System.err.println("Runtime error accepting case: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error accepting case: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An unexpected error occurred while accepting the case."));
        }
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<Object> rejectCase(@PathVariable UUID id) {
        try {
            User currentUser = authService.getCurrentUser();
            Case updatedCase = caseService.updateCaseStatus(id, Case.Status.CLOSED, currentUser);
            return ResponseEntity.ok(updatedCase);
        } catch (RuntimeException e) {
            System.err.println("Runtime error rejecting case: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error rejecting case: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An unexpected error occurred while rejecting the case."));
        }
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<Object> closeCase(@PathVariable UUID id) {
        try {
            User currentUser = authService.getCurrentUser();
            Case updatedCase = caseService.updateCaseStatus(id, Case.Status.CLOSED, currentUser);
            return ResponseEntity.ok(updatedCase);
        } catch (RuntimeException e) {
            System.err.println("Runtime error closing case: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            System.err.println("Unexpected error closing case: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "An unexpected error occurred while closing the case."));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<Object> deleteCase(@PathVariable UUID id) {
        try {
            User currentUser = authService.getCurrentUser();
            caseService.deleteCase(id, currentUser);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error deleting case: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<Object> getRecentCases(@RequestParam(defaultValue = "5") int limit) {
        try {
            User currentUser = authService.getCurrentUser();
            List<Case> recentCases;

            if (currentUser.getRole() == User.Role.LAWYER) {
                recentCases = caseService.getRecentCasesByLawyer(currentUser, limit);
            } else {
                recentCases = caseService.getRecentCasesByClient(currentUser, limit);
            }

            return ResponseEntity.ok(recentCases);
        } catch (Exception e) {
            System.err.println("Error fetching recent cases: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    private CaseResponse convertToCaseResponse(Case caseEntity) {
        CaseResponse response = new CaseResponse();
        response.setId(caseEntity.getId());
        response.setCaseNumber(caseEntity.getCaseNumber());
        response.setTitle(caseEntity.getTitle());
        response.setDescription(caseEntity.getDescription());
        response.setStatus(caseEntity.getStatus().name());
        
        // Set client info
        if (caseEntity.getClient() != null) {
            CaseResponse.UserInfo clientInfo = new CaseResponse.UserInfo();
            clientInfo.setId(caseEntity.getClient().getId().toString());
            clientInfo.setName(caseEntity.getClient().getName());
            response.setClient(clientInfo);
        }
        
        // Set lawyer info
        if (caseEntity.getLawyer() != null) {
            CaseResponse.UserInfo lawyerInfo = new CaseResponse.UserInfo();
            lawyerInfo.setId(caseEntity.getLawyer().getId().toString());
            lawyerInfo.setName(caseEntity.getLawyer().getName());
            response.setLawyer(lawyerInfo);
        }
        
        response.setCaseValue(caseEntity.getCaseValue());
        response.setNextHearing(caseEntity.getNextHearing());
        response.setUpdatedAt(caseEntity.getUpdatedAt());
        response.setCreatedAt(caseEntity.getCreatedAt());
        return response;
    }
}
