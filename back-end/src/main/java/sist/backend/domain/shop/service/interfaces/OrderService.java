package sist.backend.domain.shop.service.interfaces;

import java.time.LocalDateTime;
import java.util.List;

import sist.backend.domain.shop.dto.request.*;
import sist.backend.domain.shop.dto.response.*;
import sist.backend.domain.shop.entity.*;

public interface OrderService {
    OrderResponseDTO createOrder(OrderRequestDTO requestDto);
    OrderResponseDTO getOrderById(Long orderIdx);
    List<OrderResponseDTO> getOrdersByUser(Long userIdx);
    OrderResponseDTO updateOrderStatus(Long orderIdx, OrderStatus status);
    List<OrderResponseDTO> getOrdersByStatus(OrderStatus status);
    List<OrderResponseDTO> getOrdersByDateRange(LocalDateTime start, LocalDateTime end);
    List<OrderResponseDTO> getTopSellingItems(LocalDateTime start, LocalDateTime end, int limit);
} 