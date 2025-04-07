package sist.backend.domain.shop.repository.jpa;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sist.backend.domain.shop.entity.CartItem;

@Repository
 public interface CartItemRepository extends JpaRepository<CartItem, Long> {
     Optional<CartItem> findByCartCartIdxAndItemItemIdx(Long cartIdx, Long itemIdx);
     void deleteByCartCartIdxAndItemItemIdx(Long cartIdx, Long itemIdx);
 }
