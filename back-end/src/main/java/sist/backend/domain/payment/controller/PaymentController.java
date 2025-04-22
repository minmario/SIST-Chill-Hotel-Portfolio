package sist.backend.domain.payment.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import sist.backend.domain.payment.dto.PaymentRequest;
import sist.backend.domain.payment.dto.TossPaymentResponse;
import sist.backend.domain.payment.service.PaymentService;


@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<?> pay(@RequestBody PaymentRequest request, HttpServletRequest httpRequest, @org.springframework.security.core.annotation.AuthenticationPrincipal sist.backend.domain.user.entity.User user) {
        try {
            String ipAddress = httpRequest.getRemoteAddr();
            System.out.println("[pay] called");
            System.out.println("[pay] ipAddress: " + ipAddress);
            System.out.println("[pay] user: " + (user != null ? user.getId() : "null"));
            System.out.println("[pay] PaymentRequest: " + request);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of("message", "로그인 정보가 없습니다. 인증이 필요합니다."));
            }
            sist.backend.domain.shop.entity.Order order = paymentService.processPayment(request, ipAddress, user);
            Map<String, Object> result = new HashMap<>();
            if (order != null) {
                System.out.println("[pay] orderIdx: " + order.getOrderIdx());
                result.put("orderIdx", order.getOrderIdx());
            } else if (request.getReservationNum() != null) {
                System.out.println("[pay] reservationNum: " + request.getReservationNum());
                result.put("reservationNum", request.getReservationNum());
            }
            // 항상 JSON 객체 반환
            System.out.println("[pay] response: " + result);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", e.getMessage() != null ? e.getMessage() : "서버 내부 오류"));
        }
    }
    
    @PostMapping("/toss/success")
    public ResponseEntity<?> tossPaymentSuccess(@RequestBody TossPaymentResponse response, HttpServletRequest httpRequest, @org.springframework.security.core.annotation.AuthenticationPrincipal sist.backend.domain.user.entity.User user) {
        System.out.println("[toss/success] called");
        System.out.println("[toss/success] paymentKey: " + response.getPaymentKey());
        System.out.println("[toss/success] orderId: " + response.getOrderId());
        System.out.println("[toss/success] amount: " + response.getAmount());
        System.out.println("[toss/success] status: " + response.getStatus());
        System.out.println("[toss/success] message: " + response.getMessage());
        String ipAddress = httpRequest.getRemoteAddr();
        boolean success = paymentService.processTossPayment(response, ipAddress, user);
        if (success) {
            return ResponseEntity.ok().body(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/toss/fail")
    public ResponseEntity<?> tossPaymentFail(@RequestBody TossPaymentResponse response) {
        return ResponseEntity.badRequest().body(response);
    }
}
