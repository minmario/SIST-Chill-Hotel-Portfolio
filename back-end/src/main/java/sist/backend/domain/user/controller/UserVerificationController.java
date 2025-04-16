package sist.backend.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import sist.backend.domain.user.dto.request.PasswordVerifyRequest;
import sist.backend.domain.user.service.interfaces.UserVerificationService;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserVerificationController {

    private final UserVerificationService verificationService;

    @PostMapping("/verify-password")
    public ResponseEntity<?> verifyPassword(@RequestBody PasswordVerifyRequest request,
            HttpServletRequest httpRequest) {
        boolean isVerified = verificationService.verifyCurrentUserPassword(request.getPassword(), httpRequest);
        if (isVerified) {
            return ResponseEntity.ok("비밀번호 확인 성공");
        } else {
            return ResponseEntity.status(401).body("비밀번호가 일치하지 않습니다.");
        }
    }

}