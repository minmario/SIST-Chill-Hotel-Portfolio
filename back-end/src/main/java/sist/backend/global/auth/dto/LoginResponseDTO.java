package sist.backend.global.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponseDTO {
    private String token;
    private String email;
    private String role;
} 