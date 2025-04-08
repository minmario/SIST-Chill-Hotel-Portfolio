package sist.backend.domain.admin.service.impl;

import sist.backend.domain.admin.dto.request.LoginRequest;
import sist.backend.domain.admin.dto.response.LoginResponse;
import sist.backend.domain.admin.entity.User;
import sist.backend.domain.admin.entity.enums.UserRole;
import sist.backend.domain.admin.entity.enums.UserStatus;
import sist.backend.domain.admin.repository.UserRepository;
import sist.backend.domain.admin.service.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다."));

        if (!user.getPwd().equals(request.getPwd())) {
            throw new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("비활성화된 계정입니다.");
        }

        // 토큰 또는 세션이 필요한 경우 여기에 추가
        return new LoginResponse("dummy-token", user.getRole().name());
    }
}