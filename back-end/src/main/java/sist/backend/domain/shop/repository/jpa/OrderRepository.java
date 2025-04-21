package sist.backend.domain.shop.repository.jpa;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sist.backend.domain.shop.entity.*;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserUserIdx(Long userIdx);
    List<Order> findByOrderStatus(OrderStatus status);
    List<Order> findByOrderDateBetween(LocalDateTime start, LocalDateTime end);

    // 중복 주문 방지: 특정 user, 상태, cartItemIdxList로 PENDING 주문 조회
    @Query("SELECT o FROM Order o JOIN o.orderItems oi WHERE o.user.userIdx = :userIdx AND o.orderStatus = :status GROUP BY o HAVING COUNT(oi) = :itemCount AND SUM(CASE WHEN oi.item.itemIdx IN :cartItemIdxList THEN 1 ELSE 0 END) = :itemCount")
    Optional<Order> findPendingOrderByUserAndCartItems(@Param("userIdx") Long userIdx, @Param("status") OrderStatus status, @Param("cartItemIdxList") List<Long> cartItemIdxList, @Param("itemCount") long itemCount);
}