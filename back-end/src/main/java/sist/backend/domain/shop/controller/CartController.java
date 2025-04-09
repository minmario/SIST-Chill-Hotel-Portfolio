package sist.backend.domain.shop.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import sist.backend.domain.shop.dto.request.CartItemRequestDTO;
import sist.backend.domain.shop.dto.response.CartItemResponseDTO;
import sist.backend.domain.shop.dto.response.CartResponseDTO;
import sist.backend.domain.shop.service.interfaces.CartService;
import sist.backend.global.exception.NotFoundException;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemResponseDTO>> getCart(Authentication authentication) {
        if (authentication == null) {
            throw new AuthenticationException("인증이 필요합니다.") {};
        }
        
        try {
            String email = authentication.getName();
            log.info("장바구니 조회 요청: 사용자 이메일 = {}", email);
            
            List<CartItemResponseDTO> cartItems = cartService.getCartItems(email);
            
            return ResponseEntity.ok(cartItems);
        } catch (NotFoundException e) {
            log.error("장바구니 조회 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("장바구니 조회 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("장바구니 조회 중 오류가 발생했습니다.");
        }
    }

    @PostMapping("/items")
    public ResponseEntity<CartItemResponseDTO> addItemToCart(
            @Valid @RequestBody CartItemRequestDTO request,
            Authentication authentication) {
        if (authentication == null) {
            throw new AuthenticationException("인증이 필요합니다.") {};
        }
        
        try {
            String email = authentication.getName();
            log.info("장바구니 아이템 추가 요청: 이메일 = {}, 요청 = {}", email, request);
            
            if (request.getProductIdx() == null) {
                throw new IllegalArgumentException("상품 ID는 필수 입력값입니다.");
            }
            
            CartItemResponseDTO cartItem = cartService.addItemToCartByEmail(email, request);
            
            return ResponseEntity.ok(cartItem);
        } catch (NotFoundException e) {
            log.error("장바구니 아이템 추가 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("장바구니 아이템 추가 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("장바구니 아이템 추가 중 오류가 발생했습니다.");
        }
    }

    @PutMapping("/items/{cartItemIdx}")
    public ResponseEntity<CartResponseDTO> updateCartItem(
            @PathVariable Long cartItemIdx,
            @Valid @RequestBody CartItemRequestDTO request,
            Authentication authentication) {
        if (authentication == null) {
            throw new AuthenticationException("인증이 필요합니다.") {};
        }
        
        try {
            String email = authentication.getName();
            CartItemResponseDTO cartItem = cartService.updateCartItemByEmail(email, cartItemIdx, request);
            
            List<CartItemResponseDTO> cartItems = cartService.getCartItems(email);
            CartResponseDTO response = CartResponseDTO.builder()
                    .cartIdx(1L) // 임시 값
                    .items(cartItems)
                    .totalAmount(BigDecimal.valueOf(cartItems.stream()
                            .mapToInt(CartItemResponseDTO::getSubtotal)
                            .sum()))
                    .itemCount(cartItems.size())
                    .build();
            
            return ResponseEntity.ok(response);
        } catch (NotFoundException e) {
            log.error("장바구니 아이템 수정 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("장바구니 아이템 수정 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("장바구니 아이템 수정 중 오류가 발생했습니다.");
        }
    }

    @DeleteMapping("/items/{cartItemIdx}")
    public ResponseEntity<CartResponseDTO> removeItemFromCart(
            @PathVariable Long cartItemIdx,
            Authentication authentication) {
        if (authentication == null) {
            throw new AuthenticationException("인증이 필요합니다.") {};
        }
        
        try {
            String email = authentication.getName();
            cartService.removeItemFromCartByEmail(email, cartItemIdx);
            
            List<CartItemResponseDTO> cartItems = cartService.getCartItems(email);
            CartResponseDTO response = CartResponseDTO.builder()
                    .cartIdx(1L) // 임시 값
                    .items(cartItems)
                    .totalAmount(BigDecimal.valueOf(cartItems.stream()
                            .mapToInt(CartItemResponseDTO::getSubtotal)
                            .sum()))
                    .itemCount(cartItems.size())
                    .build();
            
            return ResponseEntity.ok(response);
        } catch (NotFoundException e) {
            log.error("장바구니 아이템 삭제 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("장바구니 아이템 삭제 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("장바구니 아이템 삭제 중 오류가 발생했습니다.");
        }
    }

    @DeleteMapping
    public ResponseEntity<CartResponseDTO> clearCart(Authentication authentication) {
        if (authentication == null) {
            throw new AuthenticationException("인증이 필요합니다.") {};
        }
        
        try {
            String email = authentication.getName();
            cartService.clearCartByEmail(email);
            
            List<CartItemResponseDTO> cartItems = cartService.getCartItems(email);
            CartResponseDTO response = CartResponseDTO.builder()
                    .cartIdx(1L) // 임시 값
                    .items(cartItems)
                    .totalAmount(BigDecimal.valueOf(cartItems.stream()
                            .mapToInt(CartItemResponseDTO::getSubtotal)
                            .sum()))
                    .itemCount(cartItems.size())
                    .build();
            
            return ResponseEntity.ok(response);
        } catch (NotFoundException e) {
            log.error("장바구니 비우기 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("장바구니 비우기 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("장바구니 비우기 중 오류가 발생했습니다.");
        }
    }
}
