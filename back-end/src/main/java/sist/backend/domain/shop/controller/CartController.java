package sist.backend.domain.shop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import sist.backend.domain.shop.dto.request.CartItemRequestDTO;
import sist.backend.domain.shop.dto.response.CartResponseDTO;
import sist.backend.domain.shop.service.CartService;
import sist.backend.domain.user.entity.User;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart(@AuthenticationPrincipal User user) {
        CartResponseDTO responseDto = cartService.getCart(user.getUserIdx());
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponseDTO> addItemToCart(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CartItemRequestDTO requestDto) {
        CartResponseDTO responseDto = cartService.addItemToCart(user.getUserIdx(), requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/items/{cartItemIdx}")
    public ResponseEntity<CartResponseDTO> updateCartItem(
            @AuthenticationPrincipal User user,
            @PathVariable Long cartItemIdx,
            @Valid @RequestBody CartItemRequestDTO requestDto) {
        CartResponseDTO responseDto = cartService.updateCartItem(user.getUserIdx(), cartItemIdx, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/items/{cartItemIdx}")
    public ResponseEntity<Void> removeItemFromCart(
            @AuthenticationPrincipal User user,
            @PathVariable Long cartItemIdx) {
        cartService.removeItemFromCart(user.getUserIdx(), cartItemIdx);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal User user) {
        cartService.clearCart(user.getUserIdx());
        return ResponseEntity.noContent().build();
    }
}
