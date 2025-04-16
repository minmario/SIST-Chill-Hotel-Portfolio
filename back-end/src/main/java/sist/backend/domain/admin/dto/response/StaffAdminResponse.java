package sist.backend.domain.admin.dto.response;

import lombok.*;
import sist.backend.domain.user.entity.User;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffAdminResponse {
    private Long userIdx;
    private String id;
    private String name;
    private String phone;
    private String email;
    private String role;
    private String status;
    private java.time.LocalDateTime createdAt;
    private java.time.LocalDateTime updatedAt;

    public static StaffAdminResponse from(User user) {
        return StaffAdminResponse.builder()
                .userIdx(user.getUserIdx())
                .id(user.getId())
                .name(user.getName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .status(user.getStatus() != null ? user.getStatus().name() : null)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}