package sist.backend.domain.payment.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sist.backend.domain.payment.dto.PaymentRequest;
import sist.backend.domain.payment.service.PaymentService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<?> pay(@RequestBody PaymentRequest request, HttpServletRequest httpRequest, @org.springframework.security.core.annotation.AuthenticationPrincipal sist.backend.domain.user.entity.User user) {
        String ipAddress = httpRequest.getRemoteAddr();
        paymentService.processPayment(request, ipAddress, user);
        return ResponseEntity.ok().build();
    }
}
