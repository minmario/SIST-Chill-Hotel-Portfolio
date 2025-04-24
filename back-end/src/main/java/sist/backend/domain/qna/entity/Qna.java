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
    @Column(name = "qna_idx") // ✅ 실제 DB 컬럼명과 일치시킴
    private Long qnaIdx;

    private String type;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String email;

    @Column(columnDefinition = "TEXT")
    private String answer;

    @Column(name = "write_date")
    private LocalDateTime writeDate;

    @Column(name = "answer_date")
    private LocalDateTime answerDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(length = 20)
    private String status;

}
