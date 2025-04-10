package sist.backend.domain.qna.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.qna.entity.Qna;
import sist.backend.domain.qna.repository.QnaRepository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/qna")
@RequiredArgsConstructor
public class QnaController {

    private final QnaRepository qnaRepository;

    @PostMapping
    public ResponseEntity<Qna> createInquiry(@RequestBody Qna qna) {
        Qna saved = qnaRepository.save(qna);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<Qna> getAllInquiries() {
        return qnaRepository.findAll(Sort.by(Sort.Direction.DESC, "writeDate"));
    }

}
