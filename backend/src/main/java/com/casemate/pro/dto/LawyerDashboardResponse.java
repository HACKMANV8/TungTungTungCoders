package com.casemate.pro.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LawyerDashboardResponse {
    private Long activeCases;
    private Long pendingCases;
    private Long closedCases;
    private Long totalClients;
    private Double monthlyRevenue;
    private Long pendingTasks;
    private List<CaseResponse> recentCases;
}
