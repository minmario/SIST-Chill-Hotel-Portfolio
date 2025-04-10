package sist.backend.domain.admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import sist.backend.domain.admin.dto.request.UserRegisterRequest;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.entity.UserRole;
import sist.backend.domain.user.entity.UserStatus;
import sist.backend.domain.admin.repository.UserRepository;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminRegisterController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /** STAFF 회원가입 API */
    @PostMapping("/register")
    public ResponseEntity<String> registerStaff(@RequestBody UserRegisterRequest request) {
        // ID 중복 체크
        if (userRepository.existsById(request.getId())) {
            return ResponseEntity.badRequest().body("이미 존재하는 아이디입니다.");
        }

        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("이미 존재하는 이메일입니다.");
        }

        // 회원 생성
        User user = new User();
        user.setId(request.getId());
        user.setPwd(passwordEncoder.encode(request.getPwd()));
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setRole(UserRole.STAFF);
        user.setStatus(UserStatus.ACTIVE);
        user.setCreatedAt(LocalDateTime.now());

        userRepository.save(user);

        return ResponseEntity.ok("STAFF 회원가입 완료");
    }
}
