package sist.backend.domain.user.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordVerifyRequest {
    private String password;
}