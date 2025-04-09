package sist.backend.domain.shop.service;

import sist.backend.domain.shop.dto.request.CartItemRequestDTO;
import sist.backend.domain.shop.dto.response.CartResponseDTO;

public interface CartService {
    CartResponseDTO getCart(Long userIdx);
    CartResponseDTO addItemToCart(Long userIdx, CartItemRequestDTO requestDto);
    CartResponseDTO updateCartItem(Long userIdx, Long cartItemIdx, CartItemRequestDTO requestDto);
    void removeItemFromCart(Long userIdx, Long cartItemIdx);
    void clearCart(Long userIdx);
} 