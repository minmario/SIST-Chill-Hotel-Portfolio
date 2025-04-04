package sist.backend.controller.api;

import org.springframework.http.ResponseEntity;
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
import sist.backend.dto.request.CartItemRequestDTO;
import sist.backend.dto.response.CartResponseDTO;
import sist.backend.service.interfaces.CartService;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userIdx}")
    public ResponseEntity<CartResponseDTO> getCart(@PathVariable Long userIdx) {
        CartResponseDTO responseDto = cartService.getCart(userIdx);
        return ResponseEntity.ok(responseDto);
    }

    @PostMapping("/{userIdx}/items")
    public ResponseEntity<CartResponseDTO> addItemToCart(
            @PathVariable Long userIdx,
            @Valid @RequestBody CartItemRequestDTO requestDto) {
        CartResponseDTO responseDto = cartService.addItemToCart(userIdx, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{userIdx}/items/{cartItemIdx}")
    public ResponseEntity<CartResponseDTO> updateCartItem(
            @PathVariable Long userIdx,
            @PathVariable Long cartItemIdx,
            @Valid @RequestBody CartItemRequestDTO requestDto) {
        CartResponseDTO responseDto = cartService.updateCartItem(userIdx, cartItemIdx, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{userIdx}/items/{cartItemIdx}")
    public ResponseEntity<Void> removeItemFromCart(
            @PathVariable Long userIdx,
            @PathVariable Long cartItemIdx) {
        cartService.removeItemFromCart(userIdx, cartItemIdx);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userIdx}")
    public ResponseEntity<Void> clearCart(@PathVariable Long userIdx) {
        cartService.clearCart(userIdx);
        return ResponseEntity.noContent().build();
    }
}
