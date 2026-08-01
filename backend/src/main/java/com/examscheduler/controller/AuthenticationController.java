package com.examscheduler.controller;

import com.examscheduler.dto.AuthResponse;
import com.examscheduler.dto.LoginRequest;
import com.examscheduler.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "Admin authentication endpoints")
public class AuthenticationController {
    
    @Autowired
    private AuthenticationService authenticationService;
    
    @PostMapping("/login")
    @Operation(summary = "Admin Login", description = "Authenticate admin and get JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login successful"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse response = authenticationService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    @Operation(summary = "Get Current Admin", description = "Get authenticated admin details")
    public ResponseEntity<String> getCurrentAdmin() {
        return ResponseEntity.ok("Current admin endpoint - implement with principal");
    }
}
