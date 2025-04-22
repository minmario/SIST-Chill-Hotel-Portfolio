package sist.backend.domain.admin.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStaffPasswordRequest {
    private String currentPassword;
    private String newPassword;
}
