package sist.backend.domain.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sist.backend.domain.shop.entity.Cart;
import sist.backend.domain.user.entity.User;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
} 