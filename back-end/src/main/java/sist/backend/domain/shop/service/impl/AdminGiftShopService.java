package sist.backend.domain.shop.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import sist.backend.domain.shop.dto.response.OrderResponse;
import sist.backend.domain.shop.entity.Order;
import sist.backend.domain.shop.repository.jpa.OrderRepository;

@Service
@RequiredArgsConstructor
public class AdminGiftShopService {
    private final OrderRepository orderRepository;

    @Transactional
    public void updateOrderStatus(Long orderIdx, String statusString) {
        Order order = orderRepository.findById(orderIdx)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다: " + orderIdx));
        sist.backend.domain.shop.entity.OrderStatus status;
        try {
            status = sist.backend.domain.shop.entity.OrderStatus.valueOf(statusString.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("잘못된 주문 상태입니다: " + statusString);
        }
        order.updateStatus(status);
        orderRepository.save(order);
    }

    @Transactional
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll(); // 또는 getAllOrders()

        return orders.stream()
            .map(order -> OrderResponse.builder()
                .orderIdx(order.getOrderIdx())
                .userName(order.getUser().getName())
                .orderStatus(order.getOrderStatus().name())
                .orderDate(order.getOrderDate())
                .totalAmount(order.getTotalAmount())
                .items(
                    order.getOrderItems().stream()
                        .map(item -> OrderResponse.OrderItemDto.builder()
                            .itemName(item.getItem().getItemName())
                            .quantity(item.getQuantity())
                            .price(item.getPrice())
                            .build()
                        ).collect(Collectors.toList())
                )
                .build()
            ).collect(Collectors.toList());
    }
}
