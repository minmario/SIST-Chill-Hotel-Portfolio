package sist.backend.domain.shop.repository.querydsl;

import java.time.LocalDateTime;
import java.util.List;

import sist.backend.domain.shop.entity.*;

public interface OrderQueryRepository {
    List<Order> findOrdersWithDetailsByUserIdx(Long userIdx);
    List<Order> findOrdersByStatusAndDateRange(OrderStatus status, LocalDateTime start, LocalDateTime end);
    List<Order> findTopSellingItems(LocalDateTime start, LocalDateTime end, int limit);
}