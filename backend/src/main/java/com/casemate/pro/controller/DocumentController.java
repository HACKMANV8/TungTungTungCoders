package com.casemate.pro.controller;

import com.casemate.pro.entity.Document;
import com.casemate.pro.entity.User;
import com.casemate.pro.service.AuthService;
import com.casemate.pro.service.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentService documentService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDocuments(
            @RequestParam(required = false) UUID caseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            User currentUser = authService.getCurrentUser();
            Page<Document> documentPage = documentService.getDocuments(currentUser, caseId, page, size);

            Map<String, Object> response = new HashMap<>();
            response.put("documents", documentPage.getContent());
            response.put("total", documentPage.getTotalElements());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("caseId") UUID caseId,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("category") Document.DocumentCategory category) {
        try {
            User currentUser = authService.getCurrentUser();
            Document document = documentService.uploadDocument(file, caseId, description, category, currentUser);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/multiple")
    public ResponseEntity<List<Document>> uploadMultipleDocuments(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("caseId") UUID caseId,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("category") Document.DocumentCategory category) {
        try {
            User currentUser = authService.getCurrentUser();
            List<Document> documents = documentService.uploadMultipleDocuments(files, caseId, description, category, currentUser);
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocument(@PathVariable UUID id) {
        try {
            User currentUser = authService.getCurrentUser();
            Document document = documentService.getDocumentById(id, currentUser);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<ByteArrayResource> downloadDocument(@PathVariable UUID id) {
        try {
            User currentUser = authService.getCurrentUser();
            Document document = documentService.getDocumentById(id, currentUser);
            byte[] data = documentService.downloadDocument(id, currentUser);

            ByteArrayResource resource = new ByteArrayResource(data);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getName() + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .contentLength(data.length)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable UUID id) {
        try {
            User currentUser = authService.getCurrentUser();
            documentService.deleteDocument(id, currentUser);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
