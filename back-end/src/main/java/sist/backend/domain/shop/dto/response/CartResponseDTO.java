package sist.backend.domain.shop.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponseDTO {
    private Long cartIdx;
    private Long userIdx;
    private BigDecimal totalPrice;
    private List<CartItemResponseDTO> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * 장바구니의 총 금액을 계산합니다.
     */
    public void calculateTotalAmount() {
        if (this.items == null || this.items.isEmpty()) {
            this.totalPrice = BigDecimal.ZERO;
            return;
        }
        
        this.totalPrice = this.items.stream()
                .map(item -> item.getSubtotal())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}