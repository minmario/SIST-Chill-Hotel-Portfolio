package sist.backend.global.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "custom.jwt")
@Getter
@Setter
public class JwtConfig {
    private String secretKey;
    private long expiration;
    private String header;
    private String prefix;
} 