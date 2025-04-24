package sist.backend.domain.qna.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
@AllArgsConstructor
public class QnaResponse {
    private Long qnaIdx;
    private String title;
    private String content;
    private String email;
    private String type;
    private String answer;
    private LocalDateTime writeDate;
}
