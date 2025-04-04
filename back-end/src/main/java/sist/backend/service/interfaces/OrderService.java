package sist.backend.service.interfaces;

import java.time.LocalDateTime;
import java.util.List;

import sist.backend.dto.request.OrderRequestDTO;
import sist.backend.dto.response.OrderResponseDTO;
import sist.backend.entity.enums.OrderStatus;

public interface OrderService {
    OrderResponseDTO createOrder(Long userIdx, OrderRequestDTO requestDto);
    OrderResponseDTO getOrderById(Long orderIdx);
    List<OrderResponseDTO> getOrdersByUser(Long userIdx);
    List<OrderResponseDTO> getOrdersByStatus(OrderStatus status);
    List<OrderResponseDTO> getOrdersByDateRange(LocalDateTime start, LocalDateTime end);
    OrderResponseDTO updateOrderStatus(Long orderIdx, OrderStatus status);
    List<OrderResponseDTO> getTopSellingItems(LocalDateTime start, LocalDateTime end, int limit);
}
