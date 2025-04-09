package sist.backend.domain.shop.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.shop.dto.mapper.OrderMapper;
import sist.backend.domain.shop.dto.request.CartItemRequestDTO;
import sist.backend.domain.shop.dto.request.OrderRequestDTO;
import sist.backend.domain.shop.dto.response.OrderResponseDTO;
import sist.backend.domain.shop.entity.Cart;
import sist.backend.domain.shop.entity.CartItem;
import sist.backend.domain.shop.entity.GiftShop;
import sist.backend.domain.shop.entity.Order;
import sist.backend.domain.shop.entity.OrderItem;
import sist.backend.domain.shop.entity.OrderStatus;
import sist.backend.domain.shop.exception.custom.ResourceNotFoundException;
import sist.backend.domain.shop.repository.jpa.CartRepository;
import sist.backend.domain.shop.repository.jpa.GiftShopRepository;
import sist.backend.domain.shop.repository.jpa.OrderItemRepository;
import sist.backend.domain.shop.repository.jpa.OrderRepository;
import sist.backend.domain.shop.repository.querydsl.OrderQueryRepository;
import sist.backend.domain.shop.service.CartService;
import sist.backend.domain.shop.service.OrderService;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.repository.UserRepository;
import sist.backend.global.exception.UnauthorizedException;

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
    private final CartService cartService;

    @Override
    @Transactional
    public OrderResponseDTO createOrder(Long userIdx, OrderRequestDTO requestDto) {
        User user = getUserById(userIdx);
        Order order = Order.builder()
                .user(user)
                .orderStatus(OrderStatus.PENDING)
                .orderDate(LocalDateTime.now())
                .build();
        
        Order savedOrder = orderRepository.save(order);
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

    private User getUserById(Long userIdx) {
        return userRepository.findById(userIdx)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다."));
    }
}