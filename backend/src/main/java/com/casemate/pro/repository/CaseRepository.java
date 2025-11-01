package com.casemate.pro.repository;

import com.casemate.pro.entity.Case;
import com.casemate.pro.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CaseRepository extends JpaRepository<Case, UUID> {
    
    Page<Case> findByLawyer(User lawyer, Pageable pageable);
    
    Page<Case> findByClient(User client, Pageable pageable);
    
    @Query("SELECT c FROM Case c WHERE c.lawyer = :lawyer AND c.status = :status")
    Page<Case> findByLawyerAndStatus(@Param("lawyer") User lawyer, 
                                     @Param("status") Case.Status status, 
                                     Pageable pageable);
    
    @Query("SELECT c FROM Case c WHERE c.client = :client AND c.status = :status")
    Page<Case> findByClientAndStatus(@Param("client") User client, 
                                     @Param("status") Case.Status status, 
                                     Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM Case c WHERE c.lawyer = :lawyer AND c.status = 'ACTIVE'")
    Long countActiveCasesByLawyer(@Param("lawyer") User lawyer);
    
    @Query("SELECT COUNT(c) FROM Case c WHERE c.lawyer = :lawyer")
    Long countCasesByLawyer(@Param("lawyer") User lawyer);
    
    @Query("SELECT COUNT(c) FROM Case c WHERE c.client = :client")
    Long countCasesByClient(@Param("client") User client);
    
    @Query("SELECT COUNT(c) FROM Case c WHERE c.lawyer = :lawyer AND c.status = 'PENDING'")
    Long countPendingCasesByLawyer(@Param("lawyer") User lawyer);
    
    @Query("SELECT COUNT(c) FROM Case c WHERE c.lawyer = :lawyer AND c.status = 'CLOSED'")
    Long countClosedCasesByLawyer(@Param("lawyer") User lawyer);
    
    @Query("SELECT COUNT(c) FROM Case c WHERE c.client = :client AND c.status = 'ACTIVE'")
    Long countActiveCasesByClient(@Param("client") User client);
    
    @Query("SELECT COUNT(c) FROM Case c WHERE c.client = :client AND c.status = 'PENDING'")
    Long countPendingCasesByClient(@Param("client") User client);
    
    @Query("SELECT COUNT(c) FROM Case c WHERE c.client = :client AND c.status = 'CLOSED'")
    Long countClosedCasesByClient(@Param("client") User client);
    
    @Query("SELECT c FROM Case c WHERE c.lawyer = :lawyer ORDER BY c.updatedAt DESC")
    List<Case> findRecentCasesByLawyer(@Param("lawyer") User lawyer, Pageable pageable);
    
    @Query("SELECT c FROM Case c WHERE c.client = :client ORDER BY c.updatedAt DESC")
    List<Case> findRecentCasesByClient(@Param("client") User client, Pageable pageable);

    List<Case> findByClientId(UUID clientId);
    
    boolean existsByCaseNumber(String caseNumber);
}