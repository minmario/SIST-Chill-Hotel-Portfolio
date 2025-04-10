package sist.backend.domain.shop.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sist.backend.domain.shop.dto.mapper.*;
import sist.backend.domain.shop.dto.request.*;
import sist.backend.domain.shop.dto.response.*;
import sist.backend.domain.shop.entity.*;
import sist.backend.domain.shop.repository.jpa.*;
import sist.backend.domain.shop.service.interfaces.*;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.repository.UserRepository;
import sist.backend.global.exception.*;

@Slf4j
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
                        .totalPrice(BigDecimal.ZERO)
                        .build()));
        
        return cartMapper.toDto(cart);
    }

    @Override
    public List<CartItemResponseDTO> getCartItems(String email) {
        log.info("장바구니 항목 조회: email={}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다: " + email));
        
        log.info("사용자 찾음: userIdx={}", user.getUserIdx());
        
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    log.info("장바구니를 찾을 수 없어 새로 생성합니다: userIdx={}", user.getUserIdx());
                    return cartRepository.save(Cart.builder()
                            .user(user)
                            .totalPrice(BigDecimal.ZERO)
                            .build());
                });
        
        log.info("장바구니 찾음: cartIdx={}, 항목 수={}", cart.getCartIdx(), cart.getItems().size());
        
        return cart.getItems().stream()
                .map(cartMapper::toCartItemResponseDTO)
                .collect(Collectors.toList());
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
                        .totalPrice(BigDecimal.ZERO)
                        .build()));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getItem().equals(product))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + requestDto.getQuantity());
            if (requestDto.getPrice() != null) {
                item.setPrice(requestDto.getPrice());
            } else if (item.getPrice() == null) {
                item.setPrice(product.getPrice());
            }
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .item(product)
                    .quantity(requestDto.getQuantity())
                    .price(requestDto.getPrice() != null ? requestDto.getPrice() : product.getPrice())
                    .build();
            cart.addItem(newItem);
            cartItemRepository.save(newItem);
        }

        cart.calculateTotalPrice();
        cartRepository.save(cart);
        return cartMapper.toDto(cart);
    }

    @Override
    public CartItemResponseDTO addItemToCartByEmail(String email, CartItemRequestDTO requestDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        
        GiftShop product = giftShopRepository.findById(requestDto.getProductIdx())
                .orElseThrow(() -> new NotFoundException("상품을 찾을 수 없습니다."));

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder()
                        .user(user)
                        .totalPrice(BigDecimal.ZERO)
                        .build()));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getItem().equals(product))
                .findFirst();

        CartItem cartItem;
        if (existingItem.isPresent()) {
            cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + requestDto.getQuantity());
            if (requestDto.getPrice() != null) {
                cartItem.setPrice(requestDto.getPrice());
            } else if (cartItem.getPrice() == null) {
                cartItem.setPrice(product.getPrice());
            }
        } else {
            cartItem = CartItem.builder()
                    .cart(cart)
                    .item(product)
                    .quantity(requestDto.getQuantity())
                    .price(requestDto.getPrice() != null ? requestDto.getPrice() : product.getPrice())
                    .build();
            cart.addItem(cartItem);
            cartItemRepository.save(cartItem);
        }

        cart.calculateTotalPrice();
        cartRepository.save(cart);
        return cartMapper.toCartItemResponseDTO(cartItem);
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
        cartItemRepository.save(cartItem);
        
        cart.calculateTotalPrice();
        cartRepository.save(cart);
        
        return cartMapper.toDto(cart);
    }

    @Override
    public CartItemResponseDTO updateCartItemByEmail(String email, Long cartItemIdx, CartItemRequestDTO requestDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("장바구니를 찾을 수 없습니다."));

        CartItem cartItem = cartItemRepository.findById(cartItemIdx)
                .orElseThrow(() -> new NotFoundException("장바구니 항목을 찾을 수 없습니다."));

        if (!cart.getItems().contains(cartItem)) {
            throw new NotFoundException("장바구니에 해당 항목이 없습니다.");
        }

        cartItem.setQuantity(requestDto.getQuantity());
        cartItemRepository.save(cartItem);
        
        cart.calculateTotalPrice();
        cartRepository.save(cart);
        
        return cartMapper.toCartItemResponseDTO(cartItem);
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
        
        cart.calculateTotalPrice();
        cartRepository.save(cart);
    }

    @Override
    public void removeItemFromCartByEmail(String email, Long cartItemIdx) {
        User user = userRepository.findByEmail(email)
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
        
        cart.calculateTotalPrice();
        cartRepository.save(cart);
    }

    @Override
    public void clearCart(Long userIdx) {
        User user = userRepository.findById(userIdx)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("장바구니를 찾을 수 없습니다."));

        List<CartItem> items = new ArrayList<>(cart.getItems());
        cart.clearItems();
        cartItemRepository.deleteAll(items);
        
        cartRepository.save(cart);
    }

    @Override
    public void clearCartByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("장바구니를 찾을 수 없습니다."));

        List<CartItem> items = new ArrayList<>(cart.getItems());
        cart.clearItems();
        cartItemRepository.deleteAll(items);
        
        cartRepository.save(cart);
    }
}
