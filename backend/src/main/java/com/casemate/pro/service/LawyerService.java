package com.casemate.pro.service;

import com.casemate.pro.entity.User;
import com.casemate.pro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LawyerService {

    private final UserRepository userRepository;

    public List<User> getAllLawyers() {
        return userRepository.findAllByRole(User.Role.LAWYER);
    }
}
