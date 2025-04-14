package sist.backend.domain.user.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.repository.UserRepository;
import sist.backend.domain.user.service.interfaces.UserVerificationService;
import sist.backend.global.jwt.JwtProvider;

@Service
@RequiredArgsConstructor
public class UserVerificationServiceImpl implements UserVerificationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Override
    public boolean verifyCurrentUserPassword(String password, HttpServletRequest request) {
        String userId = jwtProvider.extractUserId(request);
        System.out.println("userId: " + userId);

        if (userId == null) {
            System.out.println("❌ 토큰에서 userId를 추출하지 못했습니다.");
            return false;
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            System.out.println("❌ 해당 userId로 사용자를 찾을 수 없습니다.");
            return false;
        }

        System.out.println("입력된 비밀번호: " + password);
        System.out.println("DB에 저장된 암호화된 비밀번호: " + user.getPwd());

        boolean matched = passwordEncoder.matches(password, user.getPwd());
        System.out.println("비밀번호 일치 여부: " + matched);

        return matched;
    }
}