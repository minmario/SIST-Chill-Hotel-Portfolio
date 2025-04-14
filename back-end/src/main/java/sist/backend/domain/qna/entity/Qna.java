package sist.backend.domain.qna.entity;

import jakarta.persistence.*;
import lombok.*;
import sist.backend.global.common.BaseTimeEntity;

@Entity
@Table(name = "qna")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Qna extends BaseTimeEntity {

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

    // ✅ 아래 두 필드는 삭제했어:
    // private LocalDateTime writeDate;
    // private LocalDateTime answerDate;

    // ✅ 아래 두 메서드도 삭제!
    // @PrePersist
    // protected void onCreate() {
    // this.writeDate = LocalDateTime.now();
    // }

    // @PreUpdate
    // protected void onUpdate() {
    // this.updatedAt = LocalDateTime.now();
    // }

}
