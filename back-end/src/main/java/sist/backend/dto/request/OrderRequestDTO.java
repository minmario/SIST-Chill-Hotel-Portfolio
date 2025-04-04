package sist.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDTO {
    
    @NotNull(message = "결제 방법은 필수 입력값입니다")
    private Long paymentMethodIdx;
    
    // 장바구니에서 주문 시 사용
    private Boolean fromCart;
    
    // 개별 상품 주문 시 사용
    private CartItemRequestDTO directOrderItem;
}