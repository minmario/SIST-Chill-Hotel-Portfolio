package sist.backend.domain.user.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRequest {
    private String email;
    private String phone;
    private String firstName;
    private String lastName;
    private String name; // ← 🔥 이게 꼭 필요!
    private String englishFirstName;
    private String englishLastName;

    private String currentPassword;
    private String newPassword;
}