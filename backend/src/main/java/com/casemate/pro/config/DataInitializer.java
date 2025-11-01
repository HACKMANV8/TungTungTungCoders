package com.casemate.pro.config;

import com.casemate.pro.entity.Case;
import com.casemate.pro.entity.Document;
import com.casemate.pro.entity.User;
import com.casemate.pro.repository.CaseRepository;
import com.casemate.pro.repository.DocumentRepository;
import com.casemate.pro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final UserRepository userRepository;
    private final CaseRepository caseRepository;
    private final DocumentRepository documentRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initializeData() {
        return args -> {
            // Check if data already exists
            if (userRepository.count() > 2) {
                log.info("Database already initialized. Skipping data seeding.");
                return;
            }

            log.info("Initializing sample data...");

            // Create a sample lawyer if not exists
            User lawyer = userRepository.findByEmail("lawyer@lawlynk.com")
                    .orElseGet(() -> {
                        User newLawyer = new User();
                        newLawyer.setEmail("lawyer@lawlynk.com");
                        newLawyer.setPasswordHash(passwordEncoder.encode("password123"));
                        newLawyer.setName("John Smith, Esq.");
                        newLawyer.setRole(User.Role.LAWYER);
                        newLawyer.setPhone("+1 (555) 123-4567");
                        newLawyer.setAddress("123 Legal Street, Law City, LC 12345");
                        newLawyer.setAge(42);
                        newLawyer.setAboutClient("Experienced attorney with 15+ years in civil litigation and corporate law.");
                        return userRepository.save(newLawyer);
                    });

            // Create a sample client if not exists
            User client = userRepository.findByEmail("client@lawlynk.com")
                    .orElseGet(() -> {
                        User newClient = new User();
                        newClient.setEmail("client@lawlynk.com");
                        newClient.setPasswordHash(passwordEncoder.encode("password123"));
                        newClient.setName("Jane Doe");
                        newClient.setRole(User.Role.CLIENT);
                        newClient.setPhone("+1 (555) 987-6543");
                        newClient.setAddress("456 Client Avenue, Client Town, CT 54321");
                        newClient.setAge(35);
                        newClient.setAboutClient("Business owner seeking legal consultation for contract matters.");
                        return userRepository.save(newClient);
                    });

            // Create sample cases
            if (caseRepository.count() == 0) {
                Case case1 = new Case();
                case1.setCaseNumber("CS-2025-001");
                case1.setTitle("Contract Dispute - Acme Corp");
                case1.setDescription("Breach of contract case involving commercial agreements with Acme Corporation.");
                case1.setStatus(Case.Status.ACTIVE);
                case1.setLawyer(lawyer);
                case1.setClient(client);
                case1.setNextHearing(LocalDateTime.now().plusDays(15));
                caseRepository.save(case1);

                Case case2 = new Case();
                case2.setCaseNumber("CS-2025-002");
                case2.setTitle("Property Lease Agreement");
                case2.setDescription("Review and negotiation of commercial property lease terms.");
                case2.setStatus(Case.Status.PENDING);
                case2.setLawyer(lawyer);
                case2.setClient(client);
                case2.setNextHearing(LocalDateTime.now().plusDays(7));
                caseRepository.save(case2);

                Case case3 = new Case();
                case3.setCaseNumber("CS-2025-003");
                case3.setTitle("Employment Agreement Review");
                case3.setDescription("Analysis and revision of employment contract provisions.");
                case3.setStatus(Case.Status.ACTIVE);
                case3.setLawyer(lawyer);
                case3.setClient(client);
                case3.setNextHearing(LocalDateTime.now().plusDays(3));
                caseRepository.save(case3);

                Case case4 = new Case();
                case4.setCaseNumber("CS-2024-042");
                case4.setTitle("Business Partnership Dissolution");
                case4.setDescription("Legal proceedings for the dissolution of business partnership.");
                case4.setStatus(Case.Status.CLOSED);
                case4.setLawyer(lawyer);
                case4.setClient(client);
                caseRepository.save(case4);

                log.info("Created {} sample cases", caseRepository.count());

                // Create sample documents
                Document doc1 = new Document();
                doc1.setName("Contract Agreement - Signed.pdf");
                doc1.setFilePath("/documents/contract-signed.pdf");
                doc1.setType("application/pdf");
                doc1.setSize(245678L);
                doc1.setCategory(Document.DocumentCategory.CONTRACT);
                doc1.setCaseEntity(case1);
                doc1.setUploadedBy(client);
                documentRepository.save(doc1);

                Document doc2 = new Document();
                doc2.setName("Property Lease Draft.pdf");
                doc2.setFilePath("/documents/lease-draft.pdf");
                doc2.setType("application/pdf");
                doc2.setSize(156432L);
                doc2.setCategory(Document.DocumentCategory.LEASE_AGREEMENT);
                doc2.setCaseEntity(case2);
                doc2.setUploadedBy(lawyer);
                documentRepository.save(doc2);

                Document doc3 = new Document();
                doc3.setName("Employment Contract.pdf");
                doc3.setFilePath("/documents/employment-contract.pdf");
                doc3.setType("application/pdf");
                doc3.setSize(198765L);
                doc3.setCategory(Document.DocumentCategory.EMPLOYMENT_AGREEMENT);
                doc3.setCaseEntity(case3);
                doc3.setUploadedBy(client);
                documentRepository.save(doc3);

                Document doc4 = new Document();
                doc4.setName("Partnership Dissolution Notice.pdf");
                doc4.setFilePath("/documents/partnership-dissolution.pdf");
                doc4.setType("application/pdf");
                doc4.setSize(123456L);
                doc4.setCategory(Document.DocumentCategory.COURT_FILING);
                doc4.setCaseEntity(case4);
                doc4.setUploadedBy(lawyer);
                documentRepository.save(doc4);

                Document doc5 = new Document();
                doc5.setName("Case Evidence - Email Correspondence.pdf");
                doc5.setFilePath("/documents/evidence-emails.pdf");
                doc5.setType("application/pdf");
                doc5.setSize(345678L);
                doc5.setCategory(Document.DocumentCategory.EVIDENCE);
                doc5.setCaseEntity(case1);
                doc5.setUploadedBy(client);
                documentRepository.save(doc5);

                log.info("Created {} sample documents", documentRepository.count());
            }

            log.info("Sample data initialization complete!");
            log.info("Test accounts created:");
            log.info("Lawyer: lawyer@lawlynk.com / password123");
            log.info("Client: client@lawlynk.com / password123");
        };
    }
}
