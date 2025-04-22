package sist.backend.domain.shop.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
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

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sist.backend.domain.shop.dto.request.*;
import sist.backend.domain.shop.dto.response.*;

import sist.backend.domain.shop.service.interfaces.*;
import sist.backend.domain.user.entity.User;

@Slf4j
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemResponseDTO>> getCartItems(
            @AuthenticationPrincipal(expression = "user") User user) {
        System.out.println(user);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<CartItemResponseDTO> items = cartService.getCartItems(user.getEmail());
        return ResponseEntity.ok(items);
    }

    @PostMapping("/items")
    public ResponseEntity<CartItemResponseDTO> addItemToCart(
            @AuthenticationPrincipal(expression = "user") User user,
            @RequestBody CartItemRequestDTO requestDto) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        CartItemResponseDTO response = cartService.addItemToCartByEmail(user.getEmail(), requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/items/{cartItemIdx}")
    public ResponseEntity<CartItemResponseDTO> updateCartItem(
            @AuthenticationPrincipal(expression = "user") User user,
            @PathVariable Long cartItemIdx,
            @RequestBody CartItemRequestDTO requestDto) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        CartItemResponseDTO response = cartService.updateCartItemByEmail(user.getEmail(), cartItemIdx, requestDto);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/items/{cartItemIdx}")
    public ResponseEntity<Void> removeItemFromCart(
            @AuthenticationPrincipal(expression = "user") User user,
            @PathVariable Long cartItemIdx) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        cartService.removeItemFromCartByEmail(user.getEmail(), cartItemIdx);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(
            @AuthenticationPrincipal(expression = "user") User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        cartService.clearCartByEmail(user.getEmail());
        return ResponseEntity.noContent().build();
    }
}