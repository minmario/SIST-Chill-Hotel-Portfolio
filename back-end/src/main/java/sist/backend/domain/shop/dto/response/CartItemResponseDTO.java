package sist.backend.domain.shop.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonFormat;
import sist.backend.domain.shop.entity.CartItem;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponseDTO {
    @JsonProperty("cartItemIdx")
    private Long cartItemIdx;
    
    @JsonProperty("productIdx")
    private Long productIdx;
    
    @JsonProperty("productName")
    private String productName;
    
    @JsonProperty("price")
    private BigDecimal price;
    
    @JsonProperty("quantity")
    private Integer quantity;
    
    @JsonProperty("subtotal")
    private BigDecimal subtotal;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonProperty("createdAt")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonProperty("updatedAt")
    private LocalDateTime updatedAt;
    
    public void calculateSubtotal() {
        this.subtotal = this.price.multiply(BigDecimal.valueOf(this.quantity));
    }

    public static CartItemResponseDTO fromEntity(CartItem cartItem) {
        return CartItemResponseDTO.builder()
                .cartItemIdx(cartItem.getCartItemIdx())
                .productIdx(cartItem.getItem().getItemIdx())
                .productName(cartItem.getItem().getItemName())
                .quantity(cartItem.getQuantity())
                .price(cartItem.getItem().getPrice())
                .subtotal(cartItem.getItem().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())))
                .createdAt(cartItem.getCreatedAt())
                .updatedAt(cartItem.getUpdatedAt())
                .build();
    }
}