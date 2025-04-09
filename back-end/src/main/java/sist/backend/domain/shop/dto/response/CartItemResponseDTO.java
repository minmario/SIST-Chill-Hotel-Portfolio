package sist.backend.domain.shop.dto.response;

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
    private Long productIdx;
    private String productName;
    private int quantity;
    private int price;
    private int subtotal;
} 