package sist.backend.domain.admin.dto.response;

import java.time.LocalDateTime;

// Lombok 관련 어노테이션을 사용하기 위해 import
import lombok.*;
import sist.backend.domain.user.entity.User;

// 모든 필드에 대해 Getter 메서드를 자동 생성
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {

    // 사용자의 고유 번호 (Primary Key, 예: user_idx)
    private Long userIdx;

    // 사용자 ID (로그인 시 사용하는 아이디)
    private String id;

    // 사용자 이름
    private String name;

    // 사용자 이메일 주소
    private String email;

    private LocalDateTime createdAt;

    /** 엔티티 → DTO 변환 메서드 */
    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .userIdx(user.getUserIdx()) // 추가
                .id(user.getId()) // 추가
                .name(user.getName())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();
    }
}