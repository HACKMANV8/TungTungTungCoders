package com.casemate.pro.controller;

import com.casemate.pro.entity.User;
import com.casemate.pro.service.LawyerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/lawyers")
@RequiredArgsConstructor
public class LawyerController {

    private final LawyerService lawyerService;

    @GetMapping
    public ResponseEntity<List<User>> getAllLawyers() {
        List<User> lawyers = lawyerService.getAllLawyers();
        return ResponseEntity.ok(lawyers);
    }
}
