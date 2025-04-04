package sist.backend.service.impl;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import sist.backend.dto.mapper.CartMapper;
import sist.backend.dto.request.CartItemRequestDTO;
import sist.backend.dto.response.CartResponseDTO;
import sist.backend.entity.Cart;
import sist.backend.entity.CartItem;
import sist.backend.entity.GiftShop;
import sist.backend.entity.User;
import sist.backend.exception.custom.ResourceNotFoundException;
import sist.backend.repository.jpa.CartItemRepository;
import sist.backend.repository.jpa.CartRepository;
import sist.backend.repository.jpa.GiftShopRepository;
import sist.backend.repository.jpa.UserRepository;
import sist.backend.service.interfaces.CartService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final GiftShopRepository giftShopRepository;
    private final UserRepository userRepository;
    private final CartMapper cartMapper;

    @Override
    public CartResponseDTO getCart(Long userIdx) {
        Cart cart = getOrCreateCart(userIdx);
        return cartMapper.toCartDto(cart);
    }

    @Override
    @Transactional
    public CartResponseDTO addItemToCart(Long userIdx, CartItemRequestDTO requestDto) {
        Cart cart = getOrCreateCart(userIdx);
        GiftShop item = giftShopRepository.findById(requestDto.getItemIdx())
                .orElseThrow(() -> new ResourceNotFoundException("상품을 찾을 수 없습니다: " + requestDto.getItemIdx()));
        
        // 이미 장바구니에 있는 상품인지 확인
        Optional<CartItem> existingCartItem = cartItemRepository.findByCartCartIdxAndItemItemIdx(
                cart.getCartIdx(), item.getItemIdx());
        
        if (existingCartItem.isPresent()) {
            // 이미 있는 상품이면 수량 업데이트
            CartItem cartItem = existingCartItem.get();
            cartItem = CartItem.builder()
                    .cartItemIdx(cartItem.getCartItemIdx())
                    .cart(cart)
                    .item(item)
                    .quantity(cartItem.getQuantity() + requestDto.getQuantity())
                    .build();
            cartItemRepository.save(cartItem);
        } else {
            // 새 상품이면 추가
            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .item(item)
                    .quantity(requestDto.getQuantity())
                    .build();
            cart.addCartItem(cartItem);
            cartItemRepository.save(cartItem);
        }
        
        return cartMapper.toCartDto(cart);
    }

    @Override
    @Transactional
    public CartResponseDTO updateCartItem(Long userIdx, Long cartItemIdx, CartItemRequestDTO requestDto) {
        Cart cart = getOrCreateCart(userIdx);
        
        CartItem cartItem = cartItemRepository.findById(cartItemIdx)
                .orElseThrow(() -> new ResourceNotFoundException("장바구니 항목을 찾을 수 없습니다: " + cartItemIdx));
        
        if (!cartItem.getCart().getCartIdx().equals(cart.getCartIdx())) {
            throw new IllegalArgumentException("해당 사용자의 장바구니 항목이 아닙니다");
        }
        
        // 수량 업데이트
        cartItem = CartItem.builder()
                .cartItemIdx(cartItem.getCartItemIdx())
                .cart(cart)
                .item(cartItem.getItem())
                .quantity(requestDto.getQuantity())
                .build();
        
        cartItemRepository.save(cartItem);
        return cartMapper.toCartDto(cart);
    }

    @Override
    @Transactional
    public void removeItemFromCart(Long userIdx, Long cartItemIdx) {
        Cart cart = getOrCreateCart(userIdx);
        
        CartItem cartItem = cartItemRepository.findById(cartItemIdx)
                .orElseThrow(() -> new ResourceNotFoundException("장바구니 항목을 찾을 수 없습니다: " + cartItemIdx));
        
        if (!cartItem.getCart().getCartIdx().equals(cart.getCartIdx())) {
            throw new IllegalArgumentException("해당 사용자의 장바구니 항목이 아닙니다");
        }
        
        cartItemRepository.delete(cartItem);
    }

    @Override
    @Transactional
    public void clearCart(Long userIdx) {
        Cart cart = getOrCreateCart(userIdx);
        cart.getCartItems().clear();
        cartRepository.save(cart);
    }
    
    // 사용자의 장바구니를 가져오거나 없으면 새로 생성
    private Cart getOrCreateCart(Long userIdx) {
        User user = userRepository.findById(userIdx)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다: " + userIdx));
        
        return cartRepository.findByUserUserIdx(userIdx)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .user(user)
                            .build();
                    return cartRepository.save(newCart);
                });
    }
}