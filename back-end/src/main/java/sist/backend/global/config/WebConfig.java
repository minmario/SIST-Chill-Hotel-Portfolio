package sist.backend.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("http://localhost:3000") // 개발 환경에서 프론트엔드 오리진만 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH")
                .allowedHeaders("Authorization", "Content-Type", "X-Requested-With", "Accept") // Authorization 등 명시적 허용
                .exposedHeaders("Authorization", "Content-Disposition", "Content-Type", "Set-Cookie") // 필요한 헤더 노출
                .allowCredentials(true)
                .maxAge(3600);
    }
}
