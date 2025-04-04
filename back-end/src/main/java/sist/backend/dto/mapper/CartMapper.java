package sist.backend.dto.mapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import sist.backend.dto.response.CartItemResponseDTO;
import sist.backend.dto.response.CartResponseDTO;
import sist.backend.entity.Cart;
import sist.backend.entity.CartItem;

@Component
public class CartMapper {

    public CartItemResponseDTO toCartItemDto(CartItem entity) {
        BigDecimal subtotal = entity.getItem().getPrice().multiply(BigDecimal.valueOf(entity.getQuantity()));
        
        return CartItemResponseDTO.builder()
                .cartItemIdx(entity.getCartItemIdx())
                .itemIdx(entity.getItem().getItemIdx())
                .itemName(entity.getItem().getItemName())
                .price(entity.getItem().getPrice())
                .quantity(entity.getQuantity())
                .subtotal(subtotal)
                .build();
    }

    public CartResponseDTO toCartDto(Cart entity) {
        List<CartItemResponseDTO> items = entity.getCartItems().stream()
                .map(this::toCartItemDto)
                .collect(Collectors.toList());
        
        BigDecimal totalAmount = items.stream()
                .map(CartItemResponseDTO::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return CartResponseDTO.builder()
                .cartIdx(entity.getCartIdx())
                .items(items)
                .totalAmount(totalAmount)
                .build();
    }
}