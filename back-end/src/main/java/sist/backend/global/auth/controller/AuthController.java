package sist.backend.global.auth.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sist.backend.global.auth.dto.LoginRequestDTO;
import sist.backend.global.auth.dto.LoginResponseDTO;
import sist.backend.global.auth.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // 클라이언트에서 토큰을 삭제하므로 서버에서는 특별한 처리가 필요 없음
        return ResponseEntity.ok().build();
    }
} 