package sist.backend.domain.payment.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TossPaymentResponse {
    private String paymentKey;
    private String orderId;
    private Integer amount;
    private String status; // 'DONE', 'CANCELED' 등
    private String message;
}