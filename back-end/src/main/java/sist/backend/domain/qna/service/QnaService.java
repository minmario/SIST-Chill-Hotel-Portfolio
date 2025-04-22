package sist.backend.domain.qna.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.qna.dto.request.QnaRequest;
import sist.backend.domain.qna.entity.Qna;
import sist.backend.domain.qna.repository.QnaRepository;

@Service
@RequiredArgsConstructor
public class QnaService {

 private final QnaRepository qnaRepository;

    public void submit(QnaRequest request) {
        Qna qna = Qna.builder()
                .type(request.getType())
                .title(request.getTitle())
                .content(request.getContent())
                .email(request.getEmail())
                .writeDate(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        qnaRepository.save(qna);
    }
}
