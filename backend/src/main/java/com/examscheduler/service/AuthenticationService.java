package com.examscheduler.service;

import com.examscheduler.dto.AdminDTO;
import com.examscheduler.dto.AuthResponse;
import com.examscheduler.dto.LoginRequest;
import com.examscheduler.entity.Admin;
import com.examscheduler.repository.AdminRepository;
import com.examscheduler.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthenticationService {
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    public AuthResponse login(LoginRequest loginRequest) throws AuthenticationException {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );
        
        String token = jwtTokenProvider.generateToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(authentication.getName());
        
        Admin admin = adminRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        AdminDTO adminDTO = convertToDTO(admin);
        
        return AuthResponse.builder()
                .message("Login successful")
                .token(token)
                .refreshToken(refreshToken)
                .admin(adminDTO)
                .build();
    }
    
    private AdminDTO convertToDTO(Admin admin) {
        return AdminDTO.builder()
                .id(admin.getId())
                .username(admin.getUsername())
                .email(admin.getEmail())
                .fullName(admin.getFullName())
                .active(admin.getActive())
                .createdAt(admin.getCreatedAt())
                .updatedAt(admin.getUpdatedAt())
                .build();
    }
}
