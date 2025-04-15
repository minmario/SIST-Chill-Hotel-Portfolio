package sist.backend.domain.shop.repository.jpa;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sist.backend.domain.shop.entity.*;

@Repository
public interface GiftShopRepository extends JpaRepository<GiftShop, Long> {
    List<GiftShop> findByCategory(String category);
    List<GiftShop> findByCategoryStartingWith(String categoryPrefix);
    List<GiftShop> findByItemNameContaining(String keyword);
}