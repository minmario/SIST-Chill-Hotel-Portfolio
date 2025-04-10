package sist.backend.domain.shop.repository.jpa;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import sist.backend.domain.shop.entity.*;
import sist.backend.domain.user.entity.*;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
    
    @Query("SELECT c FROM Cart c LEFT JOIN FETCH c.items WHERE c.user.userIdx = :userIdx")
    Optional<Cart> findByUserIdxWithItems(@Param("userIdx") Long userIdx);
}