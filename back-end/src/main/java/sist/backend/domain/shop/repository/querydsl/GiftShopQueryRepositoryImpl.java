package sist.backend.domain.shop.repository.querydsl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.shop.entity.*;
import sist.backend.domain.shop.entity.QGiftShop;

@Repository
@RequiredArgsConstructor
 public class GiftShopQueryRepositoryImpl implements GiftShopQueryRepository {
 
     private final JPAQueryFactory queryFactory;
 
     @Override
     public List<GiftShop> findByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
         QGiftShop giftShop = QGiftShop.giftShop;
         
         return queryFactory
                 .selectFrom(giftShop)
                 .where(giftShop.price.between(minPrice, maxPrice))
                 .fetch();
     }
 
     @Override
     public List<GiftShop> findByStockLessThan(Integer threshold) {
         QGiftShop giftShop = QGiftShop.giftShop;
         
         return queryFactory
                 .selectFrom(giftShop)
                 .where(giftShop.stockQuantity.lt(threshold))
                 .fetch();
     }
 
     @Override
     public List<GiftShop> findByCategoryAndPriceRange(String category, BigDecimal minPrice, BigDecimal maxPrice) {
         QGiftShop giftShop = QGiftShop.giftShop;
         
         return queryFactory
                 .selectFrom(giftShop)
                 .where(giftShop.category.eq(category)
                         .and(giftShop.price.between(minPrice, maxPrice)))
                 .fetch();
     }
 }
