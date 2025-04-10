package sist.backend.domain.admin.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {
    private String id;
    private String pwd;
    private String name;
    private String phone;
    private String email;
}