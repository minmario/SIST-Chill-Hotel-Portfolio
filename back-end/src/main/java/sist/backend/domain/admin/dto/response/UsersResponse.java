package sist.backend.domain.admin.dto.response;

// Lombok 관련 어노테이션을 사용하기 위해 import
import lombok.*;

// 모든 필드에 대해 Getter 메서드를 자동 생성
@Getter
// 모든 필드를 인자로 받는 생성자를 자동 생성
@AllArgsConstructor
public class UsersResponse {

    // 사용자의 고유 번호 (Primary Key, 예: user_idx)
    private Long userIdx;

    // 사용자 ID (로그인 시 사용하는 아이디)
    private String id;

    // 사용자 이름
    private String name;

    // 사용자 이메일 주소
    private String email;
}