package sist.backend.domain.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserLoginResponse {
    private String token;
    private String role;
    private String name; // ✅ 추가
    private String email;
}
