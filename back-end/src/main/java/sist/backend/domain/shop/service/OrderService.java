package sist.backend.domain.shop.service;

import java.time.LocalDateTime;
import java.util.List;

import sist.backend.domain.shop.dto.request.OrderRequestDTO;
import sist.backend.domain.shop.dto.response.OrderResponseDTO;
import sist.backend.domain.shop.entity.OrderStatus;

public interface OrderService {
    OrderResponseDTO createOrder(Long userIdx, OrderRequestDTO requestDto);
    OrderResponseDTO getOrderById(Long orderIdx);
    List<OrderResponseDTO> getOrdersByUser(Long userIdx);
    OrderResponseDTO updateOrderStatus(Long orderIdx, OrderStatus status);
    List<OrderResponseDTO> getOrdersByStatus(OrderStatus status);
    List<OrderResponseDTO> getOrdersByDateRange(LocalDateTime start, LocalDateTime end);
    List<OrderResponseDTO> getTopSellingItems(LocalDateTime start, LocalDateTime end, int limit);
} 