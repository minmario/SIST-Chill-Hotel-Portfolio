package sist.backend.domain.shop.repository.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sist.backend.domain.shop.entity.Cart;
import sist.backend.domain.shop.entity.CartItem;
import sist.backend.domain.user.entity.User;

@Repository
 public interface CartRepository extends JpaRepository<Cart, Long> {
     List<CartItem> findByUser(User user);
     Optional<Cart> findByUserUserIdx(Long userIdx);
 }