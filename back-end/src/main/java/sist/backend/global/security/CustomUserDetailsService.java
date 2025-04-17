package sist.backend.global.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 이메일로 먼저 조회, 없으면 id로도 조회
        sist.backend.domain.user.entity.User user = userRepository.findByEmail(username)
            .or(() -> userRepository.findById(username))
            .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username));
        // User 엔티티는 이미 UserDetails를 구현하고 있으므로 직접 반환
        return user;
    }
} 