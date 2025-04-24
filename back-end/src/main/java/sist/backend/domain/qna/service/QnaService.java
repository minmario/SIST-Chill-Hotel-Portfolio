package sist.backend.domain.qna.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.*;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.qna.dto.request.QnaRequest;
import sist.backend.domain.qna.dto.response.QnaResponse;
import sist.backend.domain.qna.dto.request.QnaAnswerRequest;
import sist.backend.domain.qna.entity.Qna;
import sist.backend.domain.qna.repository.QnaRepository;
import sist.backend.domain.qna_mail.service.MailService;

@Service
@RequiredArgsConstructor
public class QnaService {

    private final QnaRepository qnaRepository;
    private final MailService mailService;

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

    public void answer(QnaAnswerRequest request) {
        Qna qna = qnaRepository.findById(request.getQnaIdx())
                .orElseThrow(() -> new IllegalArgumentException("문의글을 찾을 수 없습니다."));

        qna.setAnswer(request.getAnswer());
        qna.setAnswerDate(LocalDateTime.now());

        mailService.send(
                qna.getEmail(),
                "[호텔 문의 답변] " + qna.getTitle(),
                "고객님께서 작성하신 문의에 대한 답변입니다:\n\n" + request.getAnswer()
        );
    }

    public List<QnaResponse> getAll() {
        List<Qna> qnaList = qnaRepository.findAll();
    
        return qnaList.stream()
            .map((Qna qna) -> {
                return QnaResponse.builder()
                    .qnaIdx(qna.getQnaIdx())
                    .title(qna.getTitle())
                    .content(qna.getContent())
                    .email(qna.getEmail())
                    .type(qna.getType())
                    .answer(qna.getAnswer())
                    .writeDate(qna.getWriteDate())
                    .build();
            })
            .collect(Collectors.toList());
    }
    
}
