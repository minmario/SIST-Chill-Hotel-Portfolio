package sist.backend.global.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.user.repository.UserRepository;
import sist.backend.domain.user.entity.User;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 데이터베이스에서 이메일로 사용자 조회
        sist.backend.domain.user.entity.User user = userRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username));

        // User 엔티티는 이미 UserDetails를 구현하고 있으므로 직접 반환
        return user;
    }
} 