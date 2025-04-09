package sist.backend.domain.shop.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonFormat;
import sist.backend.domain.shop.entity.Cart;
import sist.backend.domain.shop.entity.CartItem;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponseDTO {
    @JsonProperty("cart_idx")
    private Long cartIdx;
    
    @JsonProperty("items")
    private List<CartItemResponseDTO> items;
    
    @JsonProperty("total_amount")
    private BigDecimal totalAmount;
    
    @JsonProperty("item_count")
    private int itemCount;
    
    @JsonProperty("created_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonProperty("updated_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
    
    public void calculateTotalAmount() {
        this.totalAmount = items.stream()
            .map(CartItemResponseDTO::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        this.itemCount = items.size();
    }

    public static CartResponseDTO fromEntity(Cart cart) {
        List<CartItemResponseDTO> items = cart.getItems().stream()
                .map(CartItemResponseDTO::fromEntity)
                .collect(Collectors.toList());

        return CartResponseDTO.builder()
                .cartIdx(cart.getCartIdx())
                .items(items)
                .totalAmount(cart.getTotalPrice())
                .itemCount(items.size())
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .build();
    }
}
