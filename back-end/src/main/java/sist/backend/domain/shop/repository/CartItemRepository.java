package sist.backend.domain.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sist.backend.domain.shop.entity.Cart;
import sist.backend.domain.shop.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    void deleteByCart(Cart cart);
} 