package sist.backend.domain.dining_reservation.controller.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() // CSRF 비활성화
            .cors()           // CORS 허용
            .and()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/dining/**").permitAll() // 다이닝 API 허용
                .anyRequest().authenticated()              // 나머지는 인증 필요
            );

        return http.build();
    }
}
