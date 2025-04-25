package sist.backend.domain.qna.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QnaAnswerRequest {
    private Long qnaIdx;
    private String answer;
}
