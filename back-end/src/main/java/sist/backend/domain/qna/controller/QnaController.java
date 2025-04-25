package sist.backend.domain.qna.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.qna.dto.request.QnaAnswerRequest;
import sist.backend.domain.qna.dto.request.QnaRequest;
import sist.backend.domain.qna.dto.response.QnaResponse;
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

    @PostMapping("/admin/answer")
    public ResponseEntity<String> answer(@RequestBody QnaAnswerRequest request) {
        qnaService.answer(request);
        return ResponseEntity.ok("답변이 등록되고 이메일이 전송되었습니다.");
    }

    @GetMapping
    public ResponseEntity<List<QnaResponse>> getAll() {
        return ResponseEntity.ok(qnaService.getAll());
    }
}
