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
