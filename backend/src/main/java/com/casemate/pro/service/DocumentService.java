package com.casemate.pro.service;

import com.casemate.pro.entity.Document;
import com.casemate.pro.entity.Case;
import com.casemate.pro.entity.User;
import com.casemate.pro.repository.DocumentRepository;
import com.casemate.pro.repository.CaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final CaseRepository caseRepository;
    private final String uploadDir = "uploads/documents/";

    public Page<Document> getDocuments(User user, UUID caseId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("uploadedAt").descending());

        if (caseId != null) {
            Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new RuntimeException("Case not found"));

            if (!hasAccessToCase(caseEntity, user)) {
                throw new RuntimeException("Access denied to this case");
            }

            return documentRepository.findByCaseEntity(caseEntity, pageable);
        }

        return documentRepository.findByUploadedBy(user, pageable);
    }

    public List<Document> getDocumentsByCase(UUID caseId, User user) {
        Case caseEntity = caseRepository.findById(caseId)
            .orElseThrow(() -> new RuntimeException("Case not found"));

        if (!hasAccessToCase(caseEntity, user)) {
            throw new RuntimeException("Access denied to this case");
        }

        return documentRepository.findByCaseEntity(caseEntity);
    }

    public Document uploadDocument(MultipartFile file, UUID caseId, String description, Document.DocumentCategory category, User user) {
        return uploadSingleFile(file, caseId, description, category, user);
    }

    public List<Document> uploadMultipleDocuments(List<MultipartFile> files, UUID caseId, String description, Document.DocumentCategory category, User user) {
        List<Document> uploadedDocuments = new ArrayList<>();
        for (MultipartFile file : files) {
            uploadedDocuments.add(uploadSingleFile(file, caseId, description, category, user));
        }
        return uploadedDocuments;
    }

    private Document uploadSingleFile(MultipartFile file, UUID caseId, String description, Document.DocumentCategory category, User user) {
        Case caseEntity = caseRepository.findById(caseId)
            .orElseThrow(() -> new RuntimeException("Case not found"));

        if (!hasAccessToCase(caseEntity, user)) {
            throw new RuntimeException("Access denied to this case");
        }

        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            Document document = new Document();
            document.setName(file.getOriginalFilename());
            document.setFilePath(filePath.toString());
            document.setType(getFileExtension(file.getOriginalFilename()));
            document.setSize(file.getSize());
            document.setDescription(description);
            document.setCategory(category);
            document.setCaseEntity(caseEntity);
            document.setUploadedBy(user);

            return documentRepository.save(document);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    public Document getDocumentById(UUID documentId, User user) {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found"));

        if (!hasAccessToCase(document.getCaseEntity(), user)) {
            throw new RuntimeException("Access denied to this document");
        }

        return document;
    }

    public void deleteDocument(UUID documentId, User user) {
        Document document = getDocumentById(documentId, user);

        if (!document.getUploadedBy().getId().equals(user.getId()) &&
            !document.getCaseEntity().getLawyer().getId().equals(user.getId())) {
            throw new RuntimeException("You don't have permission to delete this document");
        }

        try {
            Path filePath = Paths.get(document.getFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        } catch (IOException e) {
            System.err.println("Failed to delete physical file: " + e.getMessage());
        }

        documentRepository.delete(document);
    }

    public byte[] downloadDocument(UUID documentId, User user) throws IOException {
        Document document = getDocumentById(documentId, user);
        Path filePath = Paths.get(document.getFilePath());

        if (!Files.exists(filePath)) {
            throw new RuntimeException("File not found on disk");
        }

        return Files.readAllBytes(filePath);
    }

    private boolean hasAccessToCase(Case caseEntity, User user) {
        return caseEntity.getLawyer().getId().equals(user.getId()) ||
               caseEntity.getClient().getId().equals(user.getId());
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return "unknown";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }
}
