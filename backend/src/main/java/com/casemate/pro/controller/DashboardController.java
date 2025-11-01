package com.casemate.pro.controller;

import com.casemate.pro.dto.ClientDashboardResponse;
import com.casemate.pro.dto.DashboardStatsResponse;
import com.casemate.pro.dto.LawyerDashboardResponse;
import com.casemate.pro.entity.User;
import com.casemate.pro.service.AuthService;
import com.casemate.pro.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuthService authService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<DashboardStatsResponse> getLawyerDashboardStats() {
        try {
            User currentUser = authService.getCurrentUser();
            DashboardStatsResponse stats = dashboardService.getLawyerDashboardStats(currentUser);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/client-dashboard")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<DashboardStatsResponse> getClientDashboardStats() {
        try {
            User currentUser = authService.getCurrentUser();
            DashboardStatsResponse stats = dashboardService.getClientDashboardStats(currentUser);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/lawyer/full-dashboard")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<LawyerDashboardResponse> getLawyerFullDashboard() {
        try {
            User currentUser = authService.getCurrentUser();
            LawyerDashboardResponse dashboard = dashboardService.getLawyerFullDashboard(currentUser);
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/client/full-dashboard")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ClientDashboardResponse> getClientFullDashboard() {
        try {
            User currentUser = authService.getCurrentUser();
            ClientDashboardResponse dashboard = dashboardService.getClientFullDashboard(currentUser);
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/activities")
    public ResponseEntity<?> getRecentActivities() {
        try {
            User currentUser = authService.getCurrentUser();
            return ResponseEntity.ok(dashboardService.getRecentActivities(currentUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}