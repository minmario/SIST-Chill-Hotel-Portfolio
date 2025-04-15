package sist.backend.domain.shop.repository.jpa;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sist.backend.domain.shop.entity.*;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndItem(Cart cart, GiftShop item);
    void deleteByCartCartIdx(Long cartIdx);
    List<CartItem> findByItemItemIdx(Long itemIdx);
    void deleteByItemItemIdx(Long itemIdx);
}
