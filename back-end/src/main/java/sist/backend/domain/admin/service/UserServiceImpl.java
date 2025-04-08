package sist.backend.domain.admin.service;

import java.time.LocalDate;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.admin.dto.request.UserRegisterRequest;
import sist.backend.domain.admin.entity.User;
import sist.backend.domain.admin.entity.enums.UserRole;
import sist.backend.domain.admin.entity.enums.UserStatus;
import sist.backend.domain.admin.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void registerStaff(UserRegisterRequest request) {
        if (userRepository.existsById(request.getId())) {
            throw new RuntimeException("아이디 중복");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이메일 중복");
        }

        User user = new User();
        user.setIdValue(request.getId()); // 사용자가 입력한 ID (idValue 컬럼 대응)
        user.setEmail(request.getEmail());
        user.setPwd(passwordEncoder.encode(request.getPwd()));
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setRole(UserRole.staff); // ✅ enum 정확히 지정
        user.setStatus(UserStatus.ACTIVE); // 예시. 기본값 지정 필요함
        user.setJoindate(LocalDate.now());

        userRepository.save(user);
    }
}