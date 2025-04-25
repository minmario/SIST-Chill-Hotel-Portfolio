package sist.backend.domain.qna.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.*;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import sist.backend.domain.qna.dto.request.QnaRequest;
import sist.backend.domain.qna.dto.response.QnaResponse;
import sist.backend.domain.qna.dto.request.QnaAnswerRequest;
import sist.backend.domain.qna.entity.Qna;
import sist.backend.domain.qna.repository.QnaRepository;

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
                .status("PENDING") // QnaService.submit() 내부에서
                .build();

        qnaRepository.save(qna);
    }

    @Transactional
    public void answer(QnaAnswerRequest request) {
        Qna qna = qnaRepository.findById(request.getQnaIdx())
                .orElseThrow(() -> new IllegalArgumentException("문의글을 찾을 수 없습니다."));

        qna.setAnswer(request.getAnswer());
        qna.setAnswerDate(LocalDateTime.now());
        qna.setStatus("ANSWERED");

        qnaRepository.save(qna);

        String subject = "[ChillHaven] 문의하신 \"" + qna.getTitle() + "\"에 대한 답변입니다.";
        String content = """
                <div style='font-family: "Pretendard", sans-serif; font-size: 14px; line-height: 1.6;'>
                <p>안녕하세요.</p>
                <p>고객님께서 작성하신 문의에 대한 답변을 아래와 같이 드립니다.</p>
                <hr />
                <p><b>문의 제목:</b> %s</p>
                <p><b>문의 내용:</b><br/>%s</p>
                <p><b>답변 내용:</b><br/>%s</p>
                <hr />
                <p>궁금하신 점이 더 있으시면 언제든지 문의해 주세요.</p>
                <p>감사합니다.<br/>ChillHaven 호텔 드림</p>
                </div>
                """.formatted(qna.getTitle(), qna.getContent(), request.getAnswer());

        mailService.sendHtml(qna.getEmail(), subject, content);
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
                            .status(qna.getStatus())
                            .build();
                })
                .collect(Collectors.toList());
    }

}
