package sist.backend.domain.shop.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponseDTO {
    private Long cartIdx;
    private List<CartItemResponseDTO> items;
    private BigDecimal totalAmount;
    private int itemCount;
} 