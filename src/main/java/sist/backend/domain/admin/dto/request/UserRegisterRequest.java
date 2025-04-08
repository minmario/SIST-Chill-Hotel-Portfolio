package sist.backend.domain.admin.dto.request;

// Lombok 어노테이션을 불러옴 (@Getter, @Setter 등 사용을 위해)
import lombok.*;

// 각 필드에 대해 Getter, Setter 메서드를 자동 생성해주는 Lombok 어노테이션
@Getter
@Setter
public class UserRegisterRequest {
    private String id;
    private String email;
    private String pwd;
    private String name;
    private String phone;
}