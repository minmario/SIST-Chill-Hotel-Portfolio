package sist.backend.domain.user.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sist.backend.domain.shop.entity.Order;
import sist.backend.domain.shop.entity.OrderStatus;

@Repository
 public interface OrderRepository extends JpaRepository<Order, Long> {
     List<Order> findByUserUserIdx(Long userIdx);
     List<Order> findByOrderStatus(OrderStatus status);
     List<Order> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);
 }
