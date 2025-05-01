package sist.backend.domain.payment.dto.request;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {
    // 호텔 예약 결제 시 사용
    private String reservationNum;

    // 공통 결제 정보
    private int amount;
    private String paymentMethod; // 카드, 간편결제 등

    // 기프트샵(장바구니) 결제 시 사용
    private List<Long> cartItemIdxList;
    // 기타 결제에 필요한 정보
}
