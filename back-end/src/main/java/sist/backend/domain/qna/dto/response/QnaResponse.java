package sist.backend.domain.qna.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

@Getter
@Builder
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL) // null 값은 응답에 포함하지 않음
public class QnaResponse {
    private Long qnaIdx;
    private String title;
    private String content;
    private String email;
    private String type;
    private String answer;
    private LocalDateTime writeDate;
    private LocalDateTime answerDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status; // PENDING, ANSWERED
}
