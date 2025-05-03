package sist.backend.domain.qna.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.qna.dto.request.QnaAnswerRequest;
import sist.backend.domain.qna.dto.request.QnaRequest;
import sist.backend.domain.qna.dto.response.QnaResponse;
import sist.backend.domain.qna.service.QnaService;
import sist.backend.domain.admin.service.AdminActivityLogService;
import sist.backend.infrastructure.logging.ActivityType;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/qna")
@RequiredArgsConstructor
public class QnaController {
    private final QnaService qnaService;
    private final AdminActivityLogService adminActivityLogService; // 추가

    @PostMapping
    public ResponseEntity<String> submitQna(@RequestBody QnaRequest request) {
        qnaService.submit(request);
        return ResponseEntity.ok("문의가 접수되었습니다.");
    }

    @PostMapping("/admin/answer")
    public ResponseEntity<String> answer(@RequestBody QnaAnswerRequest request, HttpServletRequest httpRequest) {
        qnaService.answer(request);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminId = authentication.getName(); // 수정: User 캐스팅 ❌, getName()으로 받기

        adminActivityLogService.logActivity(
            adminId,                         // 관리자 ID
            ActivityType.QNA_ANSWER,          // 문의 답변 작성
            "문의 번호 [" + request.getQnaIdx() + "]에 답변 작성 완료",
            getClientIp(httpRequest)
        );

        return ResponseEntity.ok("답변이 등록되고 이메일이 전송되었습니다.");
    }

    @GetMapping
    public ResponseEntity<List<QnaResponse>> getAll() {
        return ResponseEntity.ok(qnaService.getAll());
    }

    // 클라이언트 IP 가져오기
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
