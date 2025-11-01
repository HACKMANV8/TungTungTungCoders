package com.casemate.pro.service;

import com.casemate.pro.dto.CaseResponse;
import com.casemate.pro.dto.ClientDashboardResponse;
import com.casemate.pro.dto.DashboardStatsResponse;
import com.casemate.pro.dto.LawyerDashboardResponse;
import com.casemate.pro.entity.Case;
import com.casemate.pro.entity.User;
import com.casemate.pro.repository.CaseRepository;
import com.casemate.pro.repository.DocumentRepository;
import com.casemate.pro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final DocumentRepository documentRepository;

    public DashboardStatsResponse getLawyerDashboardStats(User lawyer) {
        Long activeCases = caseRepository.countActiveCasesByLawyer(lawyer);
        Long totalClients = userRepository.countClients(); // All clients for this lawyer
        Double monthlyRevenue = calculateMonthlyRevenue(lawyer); // Placeholder calculation
        Long pendingTasks = calculatePendingTasks(lawyer); // Placeholder calculation

        return new DashboardStatsResponse(activeCases, totalClients, monthlyRevenue, pendingTasks);
    }

    public DashboardStatsResponse getClientDashboardStats(User client) {
        Long activeCases = caseRepository.countCasesByClient(client);
        Long totalDocuments = documentRepository.countDocumentsByClient(client);
        
        // For clients, we'll use different metrics
        return new DashboardStatsResponse(
            activeCases,
            totalDocuments, // Using document count instead of client count
            0.0, // Clients don't need revenue data
            0L // Clients don't need pending tasks
        );
    }

    public LawyerDashboardResponse getLawyerFullDashboard(User lawyer) {
        Long activeCases = caseRepository.countActiveCasesByLawyer(lawyer);
        Long pendingCases = caseRepository.countPendingCasesByLawyer(lawyer);
        Long closedCases = caseRepository.countClosedCasesByLawyer(lawyer);
        Long totalClients = userRepository.countClients();
        Double monthlyRevenue = calculateMonthlyRevenue(lawyer);
        Long pendingTasks = calculatePendingTasks(lawyer);
        
        // Get recent 4 cases
        List<Case> recentCases = caseRepository.findRecentCasesByLawyer(lawyer, PageRequest.of(0, 4));
        List<CaseResponse> caseResponses = recentCases.stream()
            .map(this::convertToCaseResponse)
            .collect(Collectors.toList());

        return new LawyerDashboardResponse(activeCases, pendingCases, closedCases, totalClients, monthlyRevenue, pendingTasks, caseResponses);
    }

    public ClientDashboardResponse getClientFullDashboard(User client) {
        Long activeCases = caseRepository.countActiveCasesByClient(client);
        Long pendingCases = caseRepository.countPendingCasesByClient(client);
        Long closedCases = caseRepository.countClosedCasesByClient(client);
        Long totalDocuments = documentRepository.countDocumentsByClient(client);
        Long upcomingAppointments = countUpcomingAppointments(client);
        Long unreadMessages = 0L; // Placeholder - implement when message system is ready
        
        // Get recent cases
        List<Case> recentCases = caseRepository.findRecentCasesByClient(client, PageRequest.of(0, 6));
        List<CaseResponse> caseResponses = recentCases.stream()
            .map(this::convertToCaseResponse)
            .collect(Collectors.toList());

        return new ClientDashboardResponse(activeCases, pendingCases, closedCases, totalDocuments, upcomingAppointments, unreadMessages, caseResponses);
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

    private Double calculateMonthlyRevenue(User lawyer) {
        // Calculate total value from all active cases
        List<Case> allCases = caseRepository.findRecentCasesByLawyer(lawyer, PageRequest.of(0, 1000));
        
        return allCases.stream()
            .filter(c -> c.getStatus() == Case.Status.ACTIVE && c.getCaseValue() != null)
            .mapToDouble(Case::getCaseValue)
            .sum();
    }

    private Long calculatePendingTasks(User lawyer) {
        // Count PENDING cases for the lawyer
        return caseRepository.countPendingCasesByLawyer(lawyer);
    }

    private Long countUpcomingAppointments(User client) {
        // Count cases with upcoming hearings
        List<Case> cases = caseRepository.findRecentCasesByClient(client, PageRequest.of(0, 100));
        return cases.stream()
            .filter(c -> c.getNextHearing() != null && c.getNextHearing().isAfter(LocalDateTime.now()))
            .count();
    }

    public List<ActivityResponse> getRecentActivities(User user) {
        // Get recent cases for the user
        List<Case> recentCases;
        if (user.getRole() == User.Role.LAWYER) {
            recentCases = caseRepository.findRecentCasesByLawyer(user, PageRequest.of(0, 10));
        } else {
            recentCases = caseRepository.findRecentCasesByClient(user, PageRequest.of(0, 10));
        }

        // Convert to activity responses
        return recentCases.stream()
            .map(caseEntity -> {
                ActivityResponse activity = new ActivityResponse();
                activity.setId(caseEntity.getId().toString());
                activity.setCaseNumber(caseEntity.getCaseNumber());
                
                // Determine activity type and details based on case status and updates
                if (caseEntity.getNextHearing() != null && caseEntity.getNextHearing().isAfter(LocalDateTime.now())) {
                    activity.setType("hearing");
                    activity.setTitle("Upcoming Hearing");
                    activity.setDescription("Court hearing scheduled");
                    activity.setTime(formatActivityTime(caseEntity.getNextHearing()));
                } else if (caseEntity.getStatus() == Case.Status.CLOSED) {
                    activity.setType("completed");
                    activity.setTitle("Case Closed");
                    activity.setDescription(caseEntity.getTitle());
                    activity.setTime(formatActivityTime(caseEntity.getUpdatedAt()));
                } else if (caseEntity.getStatus() == Case.Status.ACTIVE) {
                    activity.setType("case_update");
                    activity.setTitle("Case Updated");
                    activity.setDescription(caseEntity.getTitle());
                    activity.setTime(formatActivityTime(caseEntity.getUpdatedAt()));
                } else {
                    activity.setType("case_update");
                    activity.setTitle("New Case");
                    activity.setDescription(caseEntity.getTitle());
                    activity.setTime(formatActivityTime(caseEntity.getCreatedAt()));
                }
                
                return activity;
            })
            .collect(Collectors.toList());
    }

    private String formatActivityTime(LocalDateTime dateTime) {
        LocalDateTime now = LocalDateTime.now();
        long hoursDiff = java.time.Duration.between(dateTime, now).toHours();
        long daysDiff = java.time.Duration.between(dateTime, now).toDays();

        if (hoursDiff < 1) {
            return "Just now";
        } else if (hoursDiff < 24) {
            return hoursDiff + " hour" + (hoursDiff > 1 ? "s" : "") + " ago";
        } else if (daysDiff == 1) {
            return "Yesterday";
        } else if (daysDiff < 7) {
            return daysDiff + " days ago";
        } else {
            return dateTime.format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy"));
        }
    }

    // Inner class for Activity Response
    @lombok.Data
    public static class ActivityResponse {
        private String id;
        private String type;
        private String title;
        private String description;
        private String time;
        private String caseNumber;
    }
}