package sist.backend.domain.payment.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sist.backend.domain.payment.dto.request.PaymentRequest;
import sist.backend.domain.payment.dto.response.TossPaymentResponse;
import sist.backend.domain.payment.service.PaymentService;
import sist.backend.domain.shop.entity.Order;
import sist.backend.domain.user.entity.User;
import sist.backend.global.security.CustomUserDetails;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            return null;
        }
        return ((CustomUserDetails) authentication.getPrincipal()).getUser();
    }

    @PostMapping
    public ResponseEntity<?> pay(@RequestBody PaymentRequest request, HttpServletRequest httpRequest) {
        try {
            String ipAddress = httpRequest.getRemoteAddr();
            log.info("[pay] called");
            log.info("[pay] ipAddress: {}", ipAddress);
            
            User user = getCurrentUser();
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("message", "로그인 정보가 없습니다. 인증이 필요합니다."));
            }
            
            log.info("[pay] user: {}", user.getId());
            log.info("[pay] PaymentRequest: {}", request);
            
            Order order = paymentService.processPayment(request, ipAddress, user);
            Map<String, Object> result = new HashMap<>();
            if (order != null) {
                log.info("[pay] orderIdx: {}", order.getOrderIdx());
                result.put("orderIdx", order.getOrderIdx());
            } else if (request.getReservationNum() != null) {
                log.info("[pay] reservationNum: {}", request.getReservationNum());
                result.put("reservationNum", request.getReservationNum());
            }
            
            log.info("[pay] response: {}", result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("[pay] Error occurred", e);
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage() != null ? e.getMessage() : "서버 내부 오류"));
        }
    }
    
    @PostMapping("/toss/success")
    @Transactional
    public ResponseEntity<?> tossPaymentSuccess(@RequestBody TossPaymentResponse response, HttpServletRequest httpRequest) {
        try {
            log.info("[toss/success] called");
            log.info("[toss/success] paymentKey: {}", response.getPaymentKey());
            log.info("[toss/success] orderId: {}", response.getOrderId());
            log.info("[toss/success] amount: {}", response.getAmount());
            log.info("[toss/success] status: {}", response.getStatus());
            log.info("[toss/success] message: {}", response.getMessage());
            
            String ipAddress = httpRequest.getRemoteAddr();
            User user = getCurrentUser();
            
            try {
                paymentService.processTossPayment(response, ipAddress, user);
                return ResponseEntity.ok().body(response);
            } catch (ObjectOptimisticLockingFailureException e) {
                log.warn("[toss/success] Optimistic locking failure occurred. Retrying...");
                // 재시도 로직 구현
                paymentService.processTossPayment(response, ipAddress, user);
                return ResponseEntity.ok().body(response);
            }
        } catch (Exception e) {
            log.error("[toss/success] Error occurred", e);
            return ResponseEntity.status(500).body(Map.of(
                "message", "결제 처리 중 오류가 발생했습니다.",
                "error", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/toss/fail")
    public ResponseEntity<?> tossPaymentFail(@RequestBody TossPaymentResponse response) {
        log.error("[toss/fail] Payment failed: {}", response);
        return ResponseEntity.badRequest().body(response);
    }
}