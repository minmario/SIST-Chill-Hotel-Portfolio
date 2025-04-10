package sist.backend.domain.qna.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "qna")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Qna {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long qnaIdx; // 문의 고유 번호

    private String type; // 문의 유형
    private String title; // 제목

    @Column(columnDefinition = "TEXT")
    private String content; // 내용

    private String email; // 이메일

    @Column(columnDefinition = "TEXT")
    private String answer; // 답변 내용

    private LocalDateTime writeDate; // 문의 작성일
    private LocalDateTime answerDate; // 답변 작성일 (선택)

    private LocalDateTime createdAt; // 엔티티 생성 시각
    private LocalDateTime updatedAt; // 엔티티 수정 시각

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.writeDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
