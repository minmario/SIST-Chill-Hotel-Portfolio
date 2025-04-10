package sist.backend.domain.auth.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sist.backend.domain.auth.dto.request.UserLoginRequest;
import sist.backend.domain.auth.dto.response.UserLoginResponse;
import sist.backend.domain.auth.service.service.UserAuthService;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.entity.UserRole;
import sist.backend.domain.user.entity.UserStatus;
import sist.backend.domain.admin.repository.AdminUserRepository;
import sist.backend.global.jwt.JwtProvider;

@Service
@RequiredArgsConstructor
public class UserAuthServiceImpl implements UserAuthService {

    private final AdminUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    @Override
    public UserLoginResponse login(UserLoginRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPwd())) {
            throw new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("비활성화된 계정입니다.");
        }

        if (user.getRole() != UserRole.USER) {
            throw new IllegalArgumentException("일반 사용자만 로그인할 수 있습니다.");
        }

        String token = jwtProvider.generateToken(user.getId(), user.getRole().name());

        return new UserLoginResponse(token, user.getRole().name());
    }
}
