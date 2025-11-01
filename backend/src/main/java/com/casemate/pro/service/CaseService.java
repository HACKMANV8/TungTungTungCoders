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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CaseService {

    private final CaseRepository caseRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public Page<Case> getCasesByLawyer(User lawyer, int page, int size, String status, String sort) {
        Pageable pageable = createPageable(page, size, sort);

        if (status != null && !status.isEmpty()) {
            Case.Status caseStatus = Case.Status.valueOf(status.toUpperCase());
            return caseRepository.findByLawyerAndStatus(lawyer, caseStatus, pageable);
        }

        return caseRepository.findByLawyer(lawyer, pageable);
    }

    public Page<Case> getCasesByClient(User client, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("updatedAt").descending());
        return caseRepository.findByClient(client, pageable);
    }

    public List<Case> getRecentCasesByLawyer(User lawyer, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return caseRepository.findRecentCasesByLawyer(lawyer, pageable);
    }

    public List<Case> getRecentCasesByClient(User client, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return caseRepository.findRecentCasesByClient(client, pageable);
    }

    @Transactional
    public Case getCaseById(UUID caseId, User user) {
        Case caseEntity = caseRepository.findById(caseId)
            .orElseThrow(() -> new RuntimeException("Case not found"));

        // Eagerly load client and lawyer to prevent LazyInitializationException
        // Accessing their IDs ensures they are loaded within the transaction
        if (caseEntity.getClient() != null) {
            caseEntity.getClient().getId();
        }
        if (caseEntity.getLawyer() != null) {
            caseEntity.getLawyer().getId();
        }

        if (!hasAccessToCase(caseEntity, user)) {
            throw new RuntimeException("Access denied to this case");
        }

        return caseEntity;
    }

    @Transactional
    public Case createCase(Case caseData, User client, User lawyer) {
        User managedLawyer = userRepository.findById(lawyer.getId())
                .orElseThrow(() -> new RuntimeException("Lawyer not found"));

        Case newCase = new Case();
        newCase.setTitle(caseData.getTitle());
        newCase.setDescription(caseData.getDescription());
        newCase.setClient(client);
        newCase.setLawyer(managedLawyer);
        newCase.setStatus(Case.Status.PENDING);

        if (caseData.getNextHearing() != null) {
            newCase.setNextHearing(caseData.getNextHearing());
        }
        
        if (caseData.getCaseValue() != null) {
            newCase.setCaseValue(caseData.getCaseValue());
        }

        return caseRepository.save(newCase);
    }

    @Transactional
    public Case updateCase(UUID caseId, Case updateData, User user) {
        Case existingCase = getCaseById(caseId, user);

        if (user.getRole() != User.Role.LAWYER || !existingCase.getLawyer().getId().equals(user.getId())) {
            throw new RuntimeException("Only the assigned lawyer can update this case");
        }

        if (updateData.getTitle() != null) existingCase.setTitle(updateData.getTitle());
        if (updateData.getDescription() != null) existingCase.setDescription(updateData.getDescription());
        if (updateData.getStatus() != null) existingCase.setStatus(updateData.getStatus());
        if (updateData.getNextHearing() != null) existingCase.setNextHearing(updateData.getNextHearing());
        if (updateData.getNotes() != null) existingCase.setNotes(updateData.getNotes());

        existingCase.setUpdatedAt(LocalDateTime.now());

        return caseRepository.save(existingCase);
    }

    @Transactional
    public Case updateCaseStatus(UUID caseId, Case.Status newStatus, User user) {
        Case existingCase = getCaseById(caseId, user);

        if (user.getRole() != User.Role.LAWYER || !existingCase.getLawyer().getId().equals(user.getId())) {
            throw new RuntimeException("Only the assigned lawyer can update the case status");
        }

        existingCase.setStatus(newStatus);
        existingCase.setUpdatedAt(LocalDateTime.now());

        if (newStatus == Case.Status.CLOSED) {
            // Only create notification if client exists
            if (existingCase.getClient() != null) {
                notificationService.createNotification(existingCase.getClient(), "Your case \"" + existingCase.getTitle() + "\" has been rejected by the lawyer.");
            } else {
                System.err.println("Warning: Client is null for case " + caseId + ". Cannot send rejection notification.");
            }
        } else if (newStatus == Case.Status.ACTIVE) {
            // Only create notification if client exists
            if (existingCase.getClient() != null) {
                notificationService.createNotification(existingCase.getClient(), "Your case \"" + existingCase.getTitle() + "\" has been accepted by the lawyer.");
            } else {
                System.err.println("Warning: Client is null for case " + caseId + ". Cannot send acceptance notification.");
            }
        }

        return caseRepository.save(existingCase);
    }

    @Transactional
    public void deleteCase(UUID caseId, User user) {
        Case caseEntity = getCaseById(caseId, user);

        if (user.getRole() != User.Role.LAWYER || !caseEntity.getLawyer().getId().equals(user.getId())) {
            throw new RuntimeException("Only the assigned lawyer can delete this case");
        }

        caseRepository.delete(caseEntity);
    }

    private boolean hasAccessToCase(Case caseEntity, User user) {
        return caseEntity.getLawyer().getId().equals(user.getId()) ||
               caseEntity.getClient().getId().equals(user.getId());
    }

    private String generateUniqueCaseNumber() {
        String caseNumber;
        do {
            caseNumber = "CS-" + java.time.Year.now() + "-" +
                String.format("%03d", (int) (Math.random() * 1000));
        } while (caseRepository.existsByCaseNumber(caseNumber));

        return caseNumber;
    }

    private Pageable createPageable(int page, int size, String sort) {
        Sort.Direction direction = Sort.Direction.DESC;
        String property = "updatedAt";

        if (sort != null) {
            switch (sort.toLowerCase()) {
                case "name":
                    property = "title";
                    direction = Sort.Direction.ASC;
                    break;
                case "status":
                    property = "status";
                    direction = Sort.Direction.ASC;
                    break;
                case "recent":
                default:
                    property = "updatedAt";
                    direction = Sort.Direction.DESC;
                    break;
            }
        }

        return PageRequest.of(page, size, Sort.by(direction, property));
    }
}
