package sist.backend.domain.admin.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    private String id; // 사용자 ID (로그인 시 사용하는 아이디)
    private String pwd; // 사용자 비밀번호 (로그인 시 사용하는 비밀번호)
}
