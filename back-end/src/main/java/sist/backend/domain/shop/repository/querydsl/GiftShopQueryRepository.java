package sist.backend.domain.shop.repository.querydsl;

import java.math.BigDecimal;
import java.util.List;

import sist.backend.domain.shop.entity.*;

public interface GiftShopQueryRepository {
    List<GiftShop> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);
    List<GiftShop> findByStockLessThan(Integer threshold);
    List<GiftShop> findByCategoryAndPriceRange(String category, BigDecimal minPrice, BigDecimal maxPrice);
}
