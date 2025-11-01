package com.casemate.pro.service;

import com.casemate.pro.entity.Case;
import com.casemate.pro.entity.User;
import com.casemate.pro.repository.CaseRepository;
import com.casemate.pro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final UserRepository userRepository;
    private final CaseRepository caseRepository;

    public Page<User> getAllClients(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());

        if (search != null && !search.trim().isEmpty()) {
            return userRepository.findClientsBySearch(search.trim(), pageable);
        }

        return userRepository.findAllClients(pageable);
    }

    public User getClientById(UUID clientId) {
        User client = userRepository.findById(clientId)
            .orElseThrow(() -> new RuntimeException("Client not found"));

        if (client.getRole() != User.Role.CLIENT) {
            throw new RuntimeException("User is not a client");
        }

        return client;
    }

    public Long getTotalClientsCount() {
        return userRepository.countClients();
    }

    public List<Case> getCasesByClientId(UUID clientId) {
        return caseRepository.findByClientId(clientId);
    }
}
