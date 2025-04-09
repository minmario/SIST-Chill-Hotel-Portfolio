package sist.backend.domain.shop.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.shop.dto.mapper.CartMapper;
import sist.backend.domain.shop.dto.request.CartItemRequestDTO;
import sist.backend.domain.shop.dto.response.CartItemResponseDTO;
import sist.backend.domain.shop.dto.response.CartResponseDTO;
import sist.backend.domain.shop.entity.Cart;
import sist.backend.domain.shop.entity.CartItem;
import sist.backend.domain.shop.entity.GiftShop;
import sist.backend.domain.shop.exception.custom.ResourceNotFoundException;
import sist.backend.domain.shop.repository.jpa.CartItemRepository;
import sist.backend.domain.shop.repository.jpa.CartRepository;
import sist.backend.domain.shop.repository.jpa.GiftShopRepository;
import sist.backend.domain.shop.service.CartService;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.repository.UserRepository;
import sist.backend.global.exception.NotFoundException;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final GiftShopRepository giftShopRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    @Override
    public CartResponseDTO getCart(Long userIdx) {
        User user = userRepository.findById(userIdx)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder()
                        .user(user)
                        .build()));
        
        return CartResponseDTO.fromEntity(cart);
    }

    @Override
    public CartResponseDTO addItemToCart(Long userIdx, CartItemRequestDTO requestDto) {
        User user = userRepository.findById(userIdx)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        
        GiftShop product = giftShopRepository.findById(requestDto.getProductIdx())
                .orElseThrow(() -> new NotFoundException("상품을 찾을 수 없습니다."));

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder()
                        .user(user)
                        .build()));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getItem().equals(product))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + requestDto.getQuantity());
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .item(product)
                    .quantity(requestDto.getQuantity())
                    .build();
            cart.addItem(newItem);
        }

        cart.calculateTotalPrice();
        return CartResponseDTO.fromEntity(cart);
    }

    @Override
    public CartResponseDTO updateCartItem(Long userIdx, Long cartItemIdx, CartItemRequestDTO requestDto) {
        User user = userRepository.findById(userIdx)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("장바구니를 찾을 수 없습니다."));

        CartItem cartItem = cartItemRepository.findById(cartItemIdx)
                .orElseThrow(() -> new NotFoundException("장바구니 항목을 찾을 수 없습니다."));

        if (!cart.getItems().contains(cartItem)) {
            throw new NotFoundException("장바구니에 해당 항목이 없습니다.");
        }

        cartItem.setQuantity(requestDto.getQuantity());
        cart.calculateTotalPrice();
        
        return CartResponseDTO.fromEntity(cart);
    }

    @Override
    public void removeItemFromCart(Long userIdx, Long cartItemIdx) {
        User user = userRepository.findById(userIdx)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("장바구니를 찾을 수 없습니다."));

        CartItem cartItem = cartItemRepository.findById(cartItemIdx)
                .orElseThrow(() -> new NotFoundException("장바구니 항목을 찾을 수 없습니다."));

        if (!cart.getItems().contains(cartItem)) {
            throw new NotFoundException("장바구니에 해당 항목이 없습니다.");
        }

        cart.removeItem(cartItem);
        cartItemRepository.delete(cartItem);
    }

    @Override
    public void clearCart(Long userIdx) {
        User user = userRepository.findById(userIdx)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("장바구니를 찾을 수 없습니다."));

        cart.clearItems();
    }
}
