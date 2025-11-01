package com.casemate.pro.controller;

import com.casemate.pro.entity.Notification;
import com.casemate.pro.entity.User;
import com.casemate.pro.service.AuthService;
import com.casemate.pro.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<Notification>> getUnreadNotifications() {
        try {
            User currentUser = authService.getCurrentUser();
            List<Notification> notifications = notificationService.getUnreadNotifications(currentUser);
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
