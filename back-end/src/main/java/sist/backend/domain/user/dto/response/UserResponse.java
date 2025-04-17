package sist.backend.domain.user.dto.response;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.entity.UserRole;
import sist.backend.domain.user.entity.UserStatus;

@Getter
@Builder
public class UserResponse {
    private Long userIdx;
    private String id;
    private String name;
    private String email;
    private String phone;

    private String firstName;
    private String lastName;
    private String englishFirstName;
    private String englishLastName;

    private UserStatus status;
    private UserRole role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static UserResponse from(User user) {
        return UserResponse.builder()
                .userIdx(user.getUserIdx())
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())

                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .englishFirstName(user.getEnglishFirstName())
                .englishLastName(user.getEnglishLastName())

                .status(user.getStatus())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}