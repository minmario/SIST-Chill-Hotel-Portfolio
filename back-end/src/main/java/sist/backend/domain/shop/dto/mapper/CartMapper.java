package sist.backend.domain.shop.dto.mapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import sist.backend.domain.shop.dto.response.CartItemResponseDTO;
import sist.backend.domain.shop.dto.response.CartResponseDTO;
import sist.backend.domain.shop.entity.Cart;
import sist.backend.domain.shop.entity.CartItem;

@Component
public class CartMapper {
    
    public CartItemResponseDTO toCartItemDto(CartItem entity) {
        CartItemResponseDTO dto = CartItemResponseDTO.builder()
                .cartItemIdx(entity.getCartItemIdx())
                .productIdx(entity.getItem().getItemIdx())
                .productName(entity.getItem().getItemName())
                .price(entity.getPrice())
                .quantity(entity.getQuantity())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
        
        dto.calculateSubtotal();
        return dto;
    }
    
    public CartResponseDTO toDto(Cart entity) {
        List<CartItemResponseDTO> items = entity.getItems().stream()
                .map(this::toCartItemDto)
                .collect(Collectors.toList());
        
        CartResponseDTO dto = CartResponseDTO.builder()
                .cartIdx(entity.getCartIdx())
                .items(items)
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
        
        dto.calculateTotalAmount();
        return dto;
    }
}
