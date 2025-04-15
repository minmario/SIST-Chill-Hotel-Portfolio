package sist.backend.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 경로 허용
                .allowedOriginPatterns("*") // 모든 오리진 패턴 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH") // 모든 HTTP 메서드 추가
                .allowedHeaders("*") // 모든 헤더 허용
                .exposedHeaders("*") // 모든 헤더 노출
                .allowCredentials(true) // 인증정보 전달 허용
                .maxAge(3600); // 프리플라이트 캐시 시간 설정 (1시간)
    }
}
