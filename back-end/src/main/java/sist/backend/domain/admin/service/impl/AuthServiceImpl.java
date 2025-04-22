package sist.backend.domain.admin.service.impl;

import sist.backend.domain.admin.dto.request.LoginRequest;
import sist.backend.domain.admin.dto.response.LoginResponse;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.entity.UserRole;
import sist.backend.domain.user.entity.UserStatus;
import sist.backend.global.jwt.JwtProvider;
import sist.backend.domain.admin.repository.AdminUserRepository;
import sist.backend.domain.admin.service.service.AuthService;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AdminUserRepository userRepository;
    private final PasswordEncoder passwordEncoder; // ✅ 추가
    private final JwtProvider jwtProvider;

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPwd(),
                user.getPwd())) {
            throw new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("비활성화된 계정입니다.");
        }
        if (user.getRole() != UserRole.STAFF && user.getRole() != UserRole.ADMIN) {
            throw new IllegalArgumentException("허용되지 않은 사용자입니다.");
        }
        Long membershipIdx = user.getMembership() != null ? user.getMembership().getMembershipIdx() : null;

        String token = jwtProvider.generateToken(
                user.getId(),
                user.getRole().name(),
                membershipIdx);

        return new LoginResponse(token, user.getRole().name());
    }
}