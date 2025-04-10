package sist.backend.domain.shop.dto.mapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import sist.backend.domain.shop.dto.response.*;
import sist.backend.domain.shop.entity.*;

@Component
public class OrderMapper {
    
    public OrderItemResponseDTO toOrderItemDto(OrderItem entity) {
        BigDecimal subtotal = entity.getPrice().multiply(BigDecimal.valueOf(entity.getQuantity()));
        
        return OrderItemResponseDTO.builder()
                .orderItemIdx(entity.getOrderItemIdx())
                .itemIdx(entity.getItem().getItemIdx())
                .itemName(entity.getItem().getItemName())
                .quantity(entity.getQuantity())
                .price(entity.getPrice())
                .subtotal(subtotal)
                .build();
    }

    public OrderResponseDTO toDto(Order entity) {
        return OrderResponseDTO.builder()
                .orderIdx(entity.getOrderIdx())
                .userIdx(entity.getUser().getUserIdx())
                .orderStatus(entity.getOrderStatus())
                .totalAmount(entity.getTotalAmount())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .orderItems(entity.getOrderItems().stream()
                        .map(this::toOrderItemDto)
                        .collect(Collectors.toList()))
                .build();
    }
    
    public List<OrderResponseDTO> toOrderDtoList(List<Order> entities) {
        return entities.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
