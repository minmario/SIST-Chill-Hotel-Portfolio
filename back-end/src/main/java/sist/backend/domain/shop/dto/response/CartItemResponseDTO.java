package sist.backend.domain.shop.dto.response;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponseDTO {
    private Long cartItemIdx;
    private Long itemIdx;
    private String itemName;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;
}