package sist.backend.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로 허용
                .allowedOrigins("http://localhost:3000") // 프론트엔드 주소
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // OPTIONS 메서드 추가
                .allowedHeaders("*") // 모든 헤더 허용
                .exposedHeaders("*") // 모든 헤더 노출
                .allowCredentials(true); // 인증정보 전달 허용
    }
}
