package sist.backend.service.interfaces;

import sist.backend.dto.request.CartItemRequestDTO;
import sist.backend.dto.response.CartResponseDTO;

public interface CartService {
    CartResponseDTO getCart(Long userIdx);
    CartResponseDTO addItemToCart(Long userIdx, CartItemRequestDTO requestDto);
    CartResponseDTO updateCartItem(Long userIdx, Long cartItemIdx, CartItemRequestDTO requestDto);
    void removeItemFromCart(Long userIdx, Long cartItemIdx);
    void clearCart(Long userIdx);
}
