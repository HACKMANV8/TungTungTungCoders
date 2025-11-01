package com.casemate.pro.controller;

import com.casemate.pro.entity.Case;
import com.casemate.pro.entity.User;
import com.casemate.pro.service.AuthService;
import com.casemate.pro.service.ClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClientController {

    private final ClientService clientService;
    private final AuthService authService;

    @GetMapping
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<Map<String, Object>> getAllClients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        try {
            Page<User> clientPage = clientService.getAllClients(page, size, search);

            Map<String, Object> response = new HashMap<>();
            response.put("clients", clientPage.getContent());
            response.put("total", clientPage.getTotalElements());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error fetching all clients: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('LAWYER')")
    public ResponseEntity<Object> getClientById(@PathVariable UUID id) { // Changed return type to ResponseEntity<Object>
        try {
            User client = clientService.getClientById(id);
            return ResponseEntity.ok(client);
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error fetching client by ID: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/cases")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Object> getMyCases() {
        try {
            User currentUser = authService.getCurrentUser();
            UUID clientId = currentUser.getId();
            List<Case> cases = clientService.getCasesByClientId(clientId);
            return ResponseEntity.ok(cases);
        } catch (RuntimeException e) {
            System.err.println("Authentication/User error in getMyCases: " + e.getMessage());
            Map<String, String> errorResponse = Map.of("error", e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            System.err.println("Error fetching client cases: " + e.getMessage());
            Map<String, String> errorResponse = Map.of("error", "An unexpected error occurred: " + e.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
