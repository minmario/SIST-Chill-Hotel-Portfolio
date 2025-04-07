package sist.backend.domain.shop.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


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
import sist.backend.domain.shop.repository.querydsl.OrderQueryRepository;
import sist.backend.domain.shop.service.interfaces.CartService;
import sist.backend.domain.shop.service.interfaces.OrderService;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.repository.OrderRepository;
import sist.backend.domain.user.repository.UserRepository;



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
        User user = userRepository.findById(userIdx)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다: " + userIdx));
        
        Order order = Order.builder()
                .user(user)
                .totalAmount(BigDecimal.ZERO) // 초기값, 나중에 계산
                .orderStatus(OrderStatus.PENDING)
                .orderDate(LocalDateTime.now())
                .build();
        
        // 장바구니에서 주문하는 경우
        if (requestDto.getFromCart() != null && requestDto.getFromCart()) {
            Cart cart = cartRepository.findByUserUserIdx(userIdx)
                    .orElseThrow(() -> new ResourceNotFoundException("장바구니를 찾을 수 없습니다"));
            
            BigDecimal totalAmount = BigDecimal.ZERO;
            
            for (CartItem cartItem : cart.getCartItems()) {
                OrderItem orderItem = OrderItem.builder()
                        .order(order)
                        .item(cartItem.getItem())
                        .quantity(cartItem.getQuantity())
                        .price(cartItem.getItem().getPrice())
                        .build();
                
                order.addOrderItem(orderItem);
                totalAmount = totalAmount.add(cartItem.getItem().getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
            }
            
            order.setTotalAmount(totalAmount);
            
            // 장바구니 비우기
            cartService.clearCart(userIdx);
        } 
        // 개별 상품 직접 주문하는 경우
        else if (requestDto.getDirectOrderItem() != null) {
            CartItemRequestDTO directOrderItem = requestDto.getDirectOrderItem();
            GiftShop item = giftShopRepository.findById(directOrderItem.getItemIdx())
                    .orElseThrow(() -> new ResourceNotFoundException("상품을 찾을 수 없습니다: " + directOrderItem.getItemIdx()));
            
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .item(item)
                    .quantity(directOrderItem.getQuantity())
                    .price(item.getPrice())
                    .build();
            
            order.addOrderItem(orderItem);
            
            BigDecimal totalAmount = item.getPrice().multiply(BigDecimal.valueOf(directOrderItem.getQuantity()));
            order.setTotalAmount(totalAmount);
        } else {
            throw new IllegalArgumentException("장바구니 또는 직접 주문 정보가 필요합니다");
        }
        
        Order savedOrder = orderRepository.save(order);
        return orderMapper.toOrderDto(savedOrder);
    }

    @Override
    public OrderResponseDTO getOrderById(Long orderIdx) {
        Order order = orderRepository.findById(orderIdx)
                .orElseThrow(() -> new ResourceNotFoundException("주문을 찾을 수 없습니다: " + orderIdx));
        return orderMapper.toOrderDto(order);
    }

    @Override
    public List<OrderResponseDTO> getOrdersByUser(Long userIdx) {
        List<Order> orders = orderQueryRepository.findOrdersWithDetailsByUserIdx(userIdx);
        return orderMapper.toOrderDtoList(orders);
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
    @Transactional
    public OrderResponseDTO updateOrderStatus(Long orderIdx, OrderStatus status) {
        Order order = orderRepository.findById(orderIdx)
                .orElseThrow(() -> new ResourceNotFoundException("주문을 찾을 수 없습니다: " + orderIdx));
        
        order = Order.builder()
                .orderIdx(order.getOrderIdx())
                .user(order.getUser())
                .totalAmount(order.getTotalAmount())
                .orderStatus(status)
                .orderDate(order.getOrderDate())
                .orderItems(order.getOrderItems())
                .build();
        
        Order updatedOrder = orderRepository.save(order);
        return orderMapper.toOrderDto(updatedOrder);
    }

    @Override
    public List<OrderResponseDTO> getTopSellingItems(LocalDateTime start, LocalDateTime end, int limit) {
        List<Order> orders = orderQueryRepository.findTopSellingItems(start, end, limit);
        return orderMapper.toOrderDtoList(orders);
    }
}