package com.casemate.pro.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardStatsResponse {
    private Long activeCases;
    private Long totalClients;
    private Double monthlyRevenue;
    private Long pendingTasks;
}