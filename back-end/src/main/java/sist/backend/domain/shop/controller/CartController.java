package sist.backend.domain.shop.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sist.backend.domain.shop.dto.request.*;
import sist.backend.domain.shop.dto.response.*;

import sist.backend.domain.shop.service.interfaces.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    
    // 테스트용 하드코딩된 이메일 (실제 구현에서는 JWT 토큰에서 추출)
    private static final String TEST_EMAIL = "test@a.a";

    @GetMapping
    public ResponseEntity<List<CartItemResponseDTO>> getCartItems() {
        // 실제 구현에서는 토큰에서 이메일을 추출
        List<CartItemResponseDTO> items = cartService.getCartItems(TEST_EMAIL);
        return ResponseEntity.ok(items);
    }

    @PostMapping("/items")
    public ResponseEntity<CartItemResponseDTO> addItemToCart(@RequestBody CartItemRequestDTO requestDto) {
        CartItemResponseDTO response = cartService.addItemToCartByEmail(TEST_EMAIL, requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/items/{cartItemIdx}")
    public ResponseEntity<CartItemResponseDTO> updateCartItem(
            @PathVariable Long cartItemIdx,
            @RequestBody CartItemRequestDTO requestDto) {
        CartItemResponseDTO response = cartService.updateCartItemByEmail(TEST_EMAIL, cartItemIdx, requestDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/items/{cartItemIdx}")
    public ResponseEntity<Void> removeItemFromCart(@PathVariable Long cartItemIdx) {
        cartService.removeItemFromCartByEmail(TEST_EMAIL, cartItemIdx);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart() {
        cartService.clearCartByEmail(TEST_EMAIL);
        return ResponseEntity.noContent().build();
    }
}