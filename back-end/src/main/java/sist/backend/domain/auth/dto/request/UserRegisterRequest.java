package sist.backend.domain.auth.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterRequest {
    private String id;
    private String email;
    private String pwd;
    private String name;
    private String phone;
    private String firstName;
    private String lastName;
} 