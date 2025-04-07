package sist.backend.domain.shop.repository.jpa;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sist.backend.domain.shop.entity.Cart;

@Repository
 public interface CartRepository extends JpaRepository<Cart, Long> {
     Optional<Cart> findByUserUserIdx(Long userIdx);
 }