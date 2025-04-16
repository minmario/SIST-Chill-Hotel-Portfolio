package sist.backend.domain.payment.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sist.backend.domain.payment.dto.PaymentRequest;
import sist.backend.domain.reservation.entity.Reservation;
import sist.backend.domain.reservation.entity.ReservationStatus;
import sist.backend.domain.reservation.repository.ReservationRepository;
import sist.backend.domain.user.entity.ActivityType;
import sist.backend.domain.user.entity.User;

import sist.backend.domain.user.service.interfaces.UserActivityLogService;
import sist.backend.domain.shop.entity.Order;
import sist.backend.domain.shop.entity.OrderItem;
import sist.backend.domain.shop.entity.GiftShop;
import sist.backend.domain.shop.entity.OrderStatus;
import sist.backend.domain.shop.repository.jpa.OrderRepository;
import sist.backend.domain.shop.repository.jpa.CartItemRepository;
import sist.backend.domain.shop.entity.CartItem;
 // 명시적으로 import

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ReservationRepository reservationRepository;
    private final UserActivityLogService userActivityLogService; // interfaces 패키지 인터페이스 사용
    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    // private final OrderItemRepository orderItemRepository;
    // private final GiftShopRepository giftShopRepository;

    @Transactional
    public void processPayment(PaymentRequest request, String ipAddress, User user) {
        // 1. 호텔 예약 결제 (reservationNum 기반)
        if (request.getReservationNum() != null && !request.getReservationNum().isEmpty()) {
            Reservation reservation = reservationRepository.findByReservationNum(request.getReservationNum())
                .orElseThrow(() -> new IllegalArgumentException("예약 없음"));
            reservation.updateStatus(ReservationStatus.CONFIRMED);

            userActivityLogService.logActivity(
                user, ActivityType.PAYMENT,
                "결제 완료: 예약번호=" + request.getReservationNum() + ", 금액=" + request.getAmount(),
                ipAddress
            );
        }
        // 2. 기프트샵/장바구니 결제 (cartItemIdxList 기반)
        else if (request.getCartItemIdxList() != null && !request.getCartItemIdxList().isEmpty()) {
            // 주문 생성
            Order order = Order.builder()
                .user(user)
                .totalAmount(java.math.BigDecimal.valueOf(request.getAmount()))
                .orderStatus(OrderStatus.PAID)
                .orderDate(java.time.LocalDateTime.now())
                .build();

            for (Long cartItemIdx : request.getCartItemIdxList()) {
                CartItem cartItem = cartItemRepository.findById(cartItemIdx)
                    .orElseThrow(() -> new IllegalArgumentException("장바구니 항목을 찾을 수 없습니다. (cartItemIdx=" + cartItemIdx + ")"));
                GiftShop item = cartItem.getItem();
                int quantity = cartItem.getQuantity();
                java.math.BigDecimal price = cartItem.getPrice();
                if (item == null || quantity <= 0 || price == null) {
                    throw new IllegalArgumentException("장바구니 항목 정보가 올바르지 않습니다. (cartItemIdx=" + cartItemIdx + ")");
                }
                OrderItem orderItem = OrderItem.builder()
                    .item(item)
                    .quantity(quantity)
                    .price(price)
                    .build();
                order.addOrderItem(orderItem);
            }
            // Order와 OrderItem 저장
            orderRepository.save(order);
            // orderItems는 cascade로 저장되거나, 필요시 orderItemRepository.saveAll(orderItems);

            userActivityLogService.logActivity(
                user, ActivityType.PAYMENT,
                "기프트샵 결제 완료: 주문번호=" + order.getOrderIdx() + ", 금액=" + request.getAmount(),
                ipAddress
            );
        } else {
            throw new IllegalArgumentException("결제 정보가 부족합니다. (reservationNum 또는 cartItemIdxList 필요)");
        }
    }
}
