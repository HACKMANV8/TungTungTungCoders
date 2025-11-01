package com.casemate.pro.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Long size;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DocumentCategory category;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime uploadedAt;

    // Relationships
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", nullable = false)
    @JsonBackReference("case-documents")
    private Case caseEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    @JsonBackReference("user-documents")
    private User uploadedBy;

    public enum DocumentCategory {
        CONTRACT,
        LEASE_AGREEMENT,
        EMPLOYMENT_AGREEMENT,
        COURT_FILING,
        EVIDENCE,
        PAN_CARD,
        AADHAR_CARD,
        DRIVING_LICENSE,
        OTHER
    }
}
