package sist.backend.domain.admin.controller;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.admin.dto.request.LoginRequest;
import sist.backend.domain.admin.dto.response.LoginResponse;

import sist.backend.domain.admin.service.impl.AuthServiceImpl;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthServiceImpl authService;

    @CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
