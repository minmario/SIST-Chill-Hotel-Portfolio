package sist.backend.domain.payment.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.payment.dto.response.TossPaymentResponse;
import sist.backend.domain.user.entity.ActivityType;
import sist.backend.domain.user.service.interfaces.UserActivityLogService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments/webhook")
public class TossPaymentWebhookController {

    private final UserActivityLogService userActivityLogService;

    @PostMapping("/toss")
    public ResponseEntity<?> tossPaymentWebhook(@RequestBody TossPaymentResponse response) {
        try {
            // 웹훅을 통한 결제 상태 업데이트 (토스페이먼츠에서 자동으로 호출)
            if ("DONE".equals(response.getStatus())) {
                // 결제 완료 처리 로직
                // 여기에선 결제 완료 상태를 데이터베이스에 반영
                // 주문 상태 업데이트 등 필요한 처리를 수행
                
                return ResponseEntity.ok().build();
            } else {
                // 결제 실패/취소 처리 로직
                // 시스템 어드민에게 알림 로그 남기기
                userActivityLogService.logActivity(
                    0L, // 시스템 로그용 더미 ID
                    ActivityType.PAYMENT_FAILED,
                    "토스 결제 실패 웹훅: " + response.getMessage() + ", 주문번호=" + response.getOrderId(),
                    "SYSTEM"
                );
                
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                "Error processing webhook: " + e.getMessage()
            );
        }
    }
} 