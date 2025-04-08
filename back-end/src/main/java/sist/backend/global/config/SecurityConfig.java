package sist.backend.global.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll() // API는 누구나 접근 가능
                .requestMatchers("/admin/**").authenticated() // 관리자만
                .anyRequest().permitAll() // 그 외 모두 허용 (개발용)
            )
            .formLogin(Customizer.withDefaults()) // 기본 로그인 폼 사용
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
            );

        return http.build();
    }
}