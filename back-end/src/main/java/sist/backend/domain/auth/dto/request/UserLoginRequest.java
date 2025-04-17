package sist.backend.domain.auth.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLoginRequest {
    private String id;
    private String pwd;
}