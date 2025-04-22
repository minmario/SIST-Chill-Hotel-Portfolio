package sist.backend.domain.admin.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStaffRequest {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private String status;
}