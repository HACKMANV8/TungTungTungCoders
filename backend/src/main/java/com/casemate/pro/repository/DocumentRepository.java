package com.casemate.pro.repository;

import com.casemate.pro.entity.Document;
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
public interface DocumentRepository extends JpaRepository<Document, UUID> {
    
    Page<Document> findByCaseEntity(Case caseEntity, Pageable pageable);
    
    List<Document> findByCaseEntity(Case caseEntity);
    
    Page<Document> findByUploadedBy(User user, Pageable pageable);

    @Query("SELECT d FROM Document d WHERE d.caseEntity.lawyer = :lawyer OR d.caseEntity.client = :user")
    Page<Document> findByUserAccess(@Param("lawyer") User lawyer, @Param("user") User user, Pageable pageable);
    
    @Query("SELECT d FROM Document d WHERE d.caseEntity = :case AND " +
           "(LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.type) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Document> findByCaseAndSearch(@Param("case") Case caseEntity, 
                                       @Param("search") String search, 
                                       Pageable pageable);
    
    @Query("SELECT COUNT(d) FROM Document d WHERE d.caseEntity.lawyer = :lawyer")
    Long countDocumentsByLawyer(@Param("lawyer") User lawyer);
    
    @Query("SELECT COUNT(d) FROM Document d WHERE d.caseEntity.client = :client")
    Long countDocumentsByClient(@Param("client") User client);
}