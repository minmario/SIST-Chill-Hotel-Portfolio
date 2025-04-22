package sist.backend.domain.qna.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.qna.dto.request.QnaRequest;
import sist.backend.domain.qna.service.QnaService;

@RestController
@RequestMapping("/api/qna")
@RequiredArgsConstructor
public class QnaController {
     private final QnaService qnaService;

    @PostMapping
    public ResponseEntity<String> submitQna(@RequestBody QnaRequest request) {
        qnaService.submit(request);
        return ResponseEntity.ok("문의가 접수되었습니다.");
    }
}
