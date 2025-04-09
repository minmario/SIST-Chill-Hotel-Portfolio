package sist.backend.global.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sist.backend.global.auth.dto.LoginRequestDTO;
import sist.backend.global.auth.dto.LoginResponseDTO;
import sist.backend.global.security.JwtUtil;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponseDTO login(LoginRequestDTO request) {
        // 테스트용 하드코딩된 사용자 검증
        if (!"test@a.a".equals(request.getEmail())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        // 비밀번호 검증 - 테스트를 위해 "1"이면 항상 성공하도록 설정
        if (!"1".equals(request.getPassword())) {
            throw new BadCredentialsException("Invalid credentials");
        }

        // JWT 토큰 생성을 위한 UserDetails 생성
        UserDetails userDetails = User.builder()
                .username(request.getEmail())
                .password("")
                .roles("USER")
                .build();

        // JWT 토큰 생성
        String token = jwtUtil.generateToken(userDetails);

        return LoginResponseDTO.builder()
                .token(token)
                .email(request.getEmail())
                .role("USER")
                .build();
    }
} 