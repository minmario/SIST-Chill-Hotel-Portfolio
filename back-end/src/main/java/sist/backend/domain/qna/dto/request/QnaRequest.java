package sist.backend.domain.qna.dto.request;

import lombok.Getter;

@Getter
public class QnaRequest {

    private String type;
    private String title;
    private String content;
    private String email;
}
