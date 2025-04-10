package sist.backend.domain.shop.dto.mapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.shop.dto.request.*;
import sist.backend.domain.shop.dto.response.*;
import sist.backend.domain.shop.entity.*;

@Component
@RequiredArgsConstructor
public class CartMapper {

    /**
     * Cart 엔티티를 CartResponseDTO로 변환합니다.
     */
    public CartResponseDTO toDto(Cart cart) {
        if (cart == null) {
            return null;
        }
        
        List<CartItemResponseDTO> itemDtos = cart.getItems().stream()
                .map(this::toCartItemResponseDTO)
                .collect(Collectors.toList());
        
        CartResponseDTO dto = CartResponseDTO.builder()
                .cartIdx(cart.getCartIdx())
                .userIdx(cart.getUser().getUserIdx())
                .totalPrice(cart.getTotalPrice())
                .items(itemDtos)
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .build();
        
        // totalPrice가 null이거나 계산이 필요한 경우에만 계산
        if (cart.getTotalPrice() == null || BigDecimal.ZERO.equals(cart.getTotalPrice())) {
            dto.calculateTotalAmount();
        }
        
        return dto;
    }
    
    /**
     * CartItem 엔티티를 CartItemResponseDTO로 변환합니다.
     */
    public CartItemResponseDTO toCartItemResponseDTO(CartItem cartItem) {
        if (cartItem == null) {
            return null;
        }
        
        GiftShop item = cartItem.getItem();
        BigDecimal price = cartItem.getPrice() != null ? cartItem.getPrice() : item.getPrice();
        
        return CartItemResponseDTO.builder()
                .cartItemIdx(cartItem.getCartItemIdx())
                .productIdx(item.getItemIdx())
                .productName(item.getItemName())
                .price(price)
                .quantity(cartItem.getQuantity())
                .subtotal(cartItem.calculateSubtotal())
                .build();
    }

    /**
     * CartItemRequestDTO를 CartItem 엔티티로 변환합니다.
     */
    public CartItem toCartItemEntity(CartItemRequestDTO dto, Cart cart, GiftShop item) {
        if (dto == null) {
            return null;
        }
        
        BigDecimal price = dto.getPrice() != null ? dto.getPrice() : item.getPrice();
        
        return CartItem.builder()
                .cart(cart)
                .item(item)
                .quantity(dto.getQuantity())
                .price(price)
                .build();
    }
}
