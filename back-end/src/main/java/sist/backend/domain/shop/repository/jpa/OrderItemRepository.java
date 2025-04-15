package sist.backend.domain.shop.repository.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sist.backend.domain.shop.entity.*;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
     List<OrderItem> findByOrderOrderIdx(Long orderIdx);
     List<OrderItem> findByItemItemIdx(Long itemIdx);
 }