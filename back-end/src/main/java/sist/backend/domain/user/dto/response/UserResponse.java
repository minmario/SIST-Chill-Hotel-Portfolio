package sist.backend.domain.user.dto.response;

import lombok.Builder;
import lombok.Getter;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.entity.UserRole;
import sist.backend.domain.user.entity.UserStatus;

import java.time.LocalDate;

@Getter
@Builder
public class UserResponse {
    private Long userIdx;
    private String id;
    private String name;
    private String email;
    private String phone;
    private LocalDate joindate;
    private UserStatus status;
    private UserRole role;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .userIdx(user.getUserIdx())
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .joindate(user.getJoindate())
                .status(user.getStatus())
                .role(user.getRole())
                .build();
    }
}