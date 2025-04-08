package sist.backend.infrastructure.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
 @EnableWebSecurity
 public class SecurityConfig {
 
     @Bean
     public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
       http.csrf(AbstractHttpConfigurer::disable)
           // 람다식 인자값을 뒤로 넘겨서 함수를 호출하는 개념.
           .headers(headers -> headers.frameOptions(
               HeadersConfigurer.FrameOptionsConfig::sameOrigin))
           .authorizeHttpRequests(
               authorize -> authorize
                   .requestMatchers("/**", "/reg", "/login", "/regLogin", "/logout")
                   // 모든 권한을 부여한다는 의미. (모든요청과 인증을 줘라는 의미.)
                   .permitAll().anyRequest().authenticated());
       return http.build();
     }
       
     @Bean
     public PasswordEncoder passwordEncoder() {
       return new BCryptPasswordEncoder();
     }
   }
