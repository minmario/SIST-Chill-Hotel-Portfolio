package sist.backend.domain.shop.service.interfaces;

import java.util.List;
import sist.backend.domain.shop.dto.request.CartItemRequestDTO;
import sist.backend.domain.shop.dto.response.CartItemResponseDTO;
import sist.backend.domain.shop.dto.response.CartResponseDTO;

/**
 * 장바구니 관련 서비스 인터페이스
 */
public interface CartService {
    // ID 기반 메서드
    CartResponseDTO getCart(Long userIdx);
    CartResponseDTO addItemToCart(Long userIdx, CartItemRequestDTO requestDto);
    CartResponseDTO updateCartItem(Long userIdx, Long cartItemIdx, CartItemRequestDTO requestDto);
    void removeItemFromCart(Long userIdx, Long cartItemIdx);
    void clearCart(Long userIdx);
    
    // 이메일 기반 메서드
    List<CartItemResponseDTO> getCartItems(String email);
    CartItemResponseDTO addItemToCartByEmail(String email, CartItemRequestDTO requestDto);
    CartItemResponseDTO updateCartItemByEmail(String email, Long cartItemIdx, CartItemRequestDTO requestDto);
    void removeItemFromCartByEmail(String email, Long cartItemIdx);
    void clearCartByEmail(String email);
} 