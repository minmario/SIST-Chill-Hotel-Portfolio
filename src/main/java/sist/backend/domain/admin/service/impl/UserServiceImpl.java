package sist.backend.domain.admin.service.impl;

import java.time.LocalDate;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.admin.dto.request.UserRegisterRequest;
import sist.backend.domain.admin.repository.UserRepository;
import sist.backend.domain.admin.service.service.UserService;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.entity.UserRole;
import sist.backend.domain.user.entity.UserStatus;

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

        User user = User.builder()
                .id(request.getId())
                .email(request.getEmail())
                .pwd(passwordEncoder.encode(request.getPwd()))
                .name(request.getName())
                .phone(request.getPhone())
                .role(UserRole.staff)
                .status(UserStatus.ACTIVE)
                .joindate(LocalDate.now())
                .build();

        userRepository.save(user);
    }
}