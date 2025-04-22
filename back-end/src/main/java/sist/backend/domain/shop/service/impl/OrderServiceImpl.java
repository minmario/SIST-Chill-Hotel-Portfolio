package sist.backend.domain.shop.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import sist.backend.domain.shop.dto.mapper.*;
import sist.backend.domain.shop.dto.request.*;
import sist.backend.domain.shop.dto.response.*;
import sist.backend.domain.shop.entity.*;
import sist.backend.domain.shop.exception.custom.ResourceNotFoundException;
import sist.backend.domain.shop.repository.jpa.*;
import sist.backend.domain.shop.repository.querydsl.*;
import sist.backend.domain.shop.service.interfaces.*;
import sist.backend.domain.user.entity.*;
import sist.backend.domain.user.repository.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final GiftShopRepository giftShopRepository;
    private final CartRepository cartRepository;
    private final OrderQueryRepository orderQueryRepository;
    private final OrderMapper orderMapper;

    @Override
    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO requestDto) {
        // 인증된 사용자 정보 추출
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal().equals("anonymousUser")) {
            throw new IllegalStateException("인증된 사용자를 찾을 수 없습니다.");
        }
        String userId = authentication.getName();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));
        System.out.println("[DEBUG] user: " + user);
        System.out.println("[DEBUG] user.getUserIdx(): " + user.getUserIdx());
        System.out.println("[DEBUG] user.getId(): " + user.getId());

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("장바구니를 찾을 수 없습니다."));
        System.out.println("[DEBUG] cart: " + cart);
        if (cart != null) {
            System.out.println("[DEBUG] cart.getUser(): " + cart.getUser());
            if (cart.getUser() != null) {
                System.out.println("[DEBUG] cart.getUser().getUserIdx(): " + cart.getUser().getUserIdx());
            }
        }

        // 결제 금액 계산 (cart의 totalPrice 사용, 없으면 0)
        BigDecimal totalAmount = cart.getTotalPrice() != null ? cart.getTotalPrice() : BigDecimal.ZERO;

        Order order = Order.builder()
                .user(user)
                .totalAmount(totalAmount)
                .orderStatus(OrderStatus.PENDING)
                .orderDate(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);

        // 장바구니 아이템을 주문 아이템으로 변환
        List<OrderItem> orderItems = cart.getItems().stream()
                .<OrderItem>map(cartItem -> OrderItem.builder()
                        .order(savedOrder)
                        .item(cartItem.getItem())
                        .quantity(cartItem.getQuantity())
                        .price(cartItem.getPrice())
                        .build())
                .collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);

        // 장바구니 비우기
        cart.clearItems();
        cartRepository.save(cart);

        return orderMapper.toDto(savedOrder);
    }

    @Override
    public OrderResponseDTO getOrderById(Long orderIdx) {
        Order order = orderRepository.findById(orderIdx)
                .orElseThrow(() -> new ResourceNotFoundException("주문을 찾을 수 없습니다."));
        return orderMapper.toDto(order);
    }

    @Override
    public List<OrderResponseDTO> getOrdersByUser(Long userIdx) {
        List<Order> orders = orderRepository.findByUserUserIdx(userIdx);
        return orderMapper.toOrderDtoList(orders);
    }

    @Override
    @Transactional
    public OrderResponseDTO updateOrderStatus(Long orderIdx, OrderStatus status) {
        Order order = orderRepository.findById(orderIdx)
                .orElseThrow(() -> new ResourceNotFoundException("주문을 찾을 수 없습니다."));

        order.updateStatus(status);
        return orderMapper.toDto(order);
    }

    @Override
    public List<OrderResponseDTO> getOrdersByStatus(OrderStatus status) {
        List<Order> orders = orderRepository.findByOrderStatus(status);
        return orderMapper.toOrderDtoList(orders);
    }

    @Override
    public List<OrderResponseDTO> getOrdersByDateRange(LocalDateTime start, LocalDateTime end) {
        List<Order> orders = orderRepository.findByOrderDateBetween(start, end);
        return orderMapper.toOrderDtoList(orders);
    }

    @Override
    public List<OrderResponseDTO> getTopSellingItems(LocalDateTime start, LocalDateTime end, int limit) {
        List<Order> orders = orderQueryRepository.findTopSellingItems(start, end, limit);
        return orderMapper.toOrderDtoList(orders);
    }

}