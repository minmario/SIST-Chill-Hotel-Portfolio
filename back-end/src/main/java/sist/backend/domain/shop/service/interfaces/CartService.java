package sist.backend.domain.shop.service.interfaces;

import java.util.List;

import sist.backend.domain.shop.dto.request.*;
import sist.backend.domain.shop.dto.response.*;

public interface CartService {
    
    /**
     * 사용자 ID로 장바구니 조회
     */
    CartResponseDTO getCart(Long userIdx);
    
    /**
     * 사용자 이메일로 장바구니 상품 목록 조회
     */
    List<CartItemResponseDTO> getCartItems(String email);
    
    /**
     * 사용자 ID로 장바구니에 상품 추가
     */
    CartResponseDTO addItemToCart(Long userIdx, CartItemRequestDTO requestDto);
    
    /**
     * 사용자 이메일로 장바구니에 상품 추가
     */
    CartItemResponseDTO addItemToCartByEmail(String email, CartItemRequestDTO requestDto);
    
    /**
     * 사용자 ID로 장바구니 상품 수량 변경
     */
    CartResponseDTO updateCartItem(Long userIdx, Long cartItemIdx, CartItemRequestDTO requestDto);
    
    /**
     * 사용자 이메일로 장바구니 상품 수량 변경
     */
    CartItemResponseDTO updateCartItemByEmail(String email, Long cartItemIdx, CartItemRequestDTO requestDto);
    
    /**
     * 사용자 ID로 장바구니에서 상품 제거
     */
    void removeItemFromCart(Long userIdx, Long cartItemIdx);
    
    /**
     * 사용자 이메일로 장바구니에서 상품 제거
     */
    void removeItemFromCartByEmail(String email, Long cartItemIdx);
    
    /**
     * 사용자 ID로 장바구니 비우기
     */
    void clearCart(Long userIdx);
    
    /**
     * 사용자 이메일로 장바구니 비우기
     */
    void clearCartByEmail(String email);
}