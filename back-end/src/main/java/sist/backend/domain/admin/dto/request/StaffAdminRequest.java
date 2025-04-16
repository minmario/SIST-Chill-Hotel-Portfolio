package sist.backend.domain.admin.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffAdminRequest {
    private String id;
    private String pwd;
    private String name;
    private String email;
    private String phone;
}