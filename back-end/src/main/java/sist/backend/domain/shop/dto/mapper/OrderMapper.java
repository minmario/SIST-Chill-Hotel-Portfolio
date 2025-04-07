package sist.backend.domain.shop.dto.mapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import sist.backend.domain.shop.dto.response.OrderItemResponseDTO;
import sist.backend.domain.shop.dto.response.OrderResponseDTO;
import sist.backend.domain.shop.entity.Order;
import sist.backend.domain.shop.entity.OrderItem;

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
 
     public OrderResponseDTO toOrderDto(Order entity) {
         List<OrderItemResponseDTO> items = entity.getOrderItems().stream()
                 .map(this::toOrderItemDto)
                 .collect(Collectors.toList());
         
         return OrderResponseDTO.builder()
                 .orderIdx(entity.getOrderIdx())
                 .userIdx(entity.getUser().getUserIdx())
                 .totalAmount(entity.getTotalAmount())
                 .orderStatus(entity.getOrderStatus())
                 .orderDate(entity.getOrderDate())
                 .orderItems(items)
                 .build();
     }
     
     public List<OrderResponseDTO> toOrderDtoList(List<Order> entities) {
         return entities.stream()
                 .map(this::toOrderDto)
                 .collect(Collectors.toList());
     }
 }
