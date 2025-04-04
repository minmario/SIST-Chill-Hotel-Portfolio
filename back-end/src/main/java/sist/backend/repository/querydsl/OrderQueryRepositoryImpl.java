package sist.backend.repository.querydsl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;
import sist.backend.entity.Order;
import sist.backend.entity.QGiftShop;
import sist.backend.entity.QOrder;
import sist.backend.entity.QOrderItem;
import sist.backend.entity.enums.OrderStatus;

@Repository
@RequiredArgsConstructor
public class OrderQueryRepositoryImpl implements OrderQueryRepository {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<Order> findOrdersWithDetailsByUserIdx(Long userIdx) {
        QOrder order = QOrder.order;
        QOrderItem orderItem = QOrderItem.orderItem;
        QGiftShop giftShop = QGiftShop.giftShop;
        
        return queryFactory
                .selectFrom(order)
                .leftJoin(order.orderItems, orderItem).fetchJoin()
                .leftJoin(orderItem.item, giftShop).fetchJoin()
                .where(order.user.userIdx.eq(userIdx))
                .orderBy(order.orderDate.desc())
                .fetch();
    }

    @Override
    public List<Order> findOrdersByStatusAndDateRange(OrderStatus status, LocalDateTime start, LocalDateTime end) {
        QOrder order = QOrder.order;
        
        return queryFactory
                .selectFrom(order)
                .where(order.orderStatus.eq(status)
                        .and(order.orderDate.between(start, end)))
                .orderBy(order.orderDate.desc())
                .fetch();
    }

    @Override
    public List<Order> findTopSellingItems(LocalDateTime start, LocalDateTime end, int limit) {
        QOrder order = QOrder.order;
        QOrderItem orderItem = QOrderItem.orderItem;
        
        return queryFactory
                .selectFrom(order)
                .leftJoin(order.orderItems, orderItem).fetchJoin()
                .where(order.orderDate.between(start, end))
                .orderBy(orderItem.quantity.sum().desc())
                .limit(limit)
                .fetch();
    }
}
