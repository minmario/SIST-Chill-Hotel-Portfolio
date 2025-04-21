package sist.backend.domain.payment.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sist.backend.domain.payment.dto.PaymentRequest;
import sist.backend.domain.payment.dto.TossPaymentResponse;
import sist.backend.domain.reservation.entity.Reservation;
import sist.backend.domain.reservation.entity.ReservationStatus;
import sist.backend.domain.user.entity.ActivityType;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.service.interfaces.UserActivityLogService;
import sist.backend.domain.reservation.repository.ReservationRepository;
import sist.backend.domain.shop.entity.CartItem;
import sist.backend.domain.shop.entity.GiftShop;
import sist.backend.domain.shop.entity.Order;
import sist.backend.domain.shop.entity.OrderItem;
import sist.backend.domain.shop.entity.OrderStatus;
import sist.backend.domain.shop.repository.jpa.CartItemRepository;
import sist.backend.domain.shop.repository.jpa.OrderRepository;
import java.util.List;
import java.util.Optional;

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
    public sist.backend.domain.shop.entity.Order processPayment(PaymentRequest request, String ipAddress, User user) {
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
            return null;
        }
        // 2. 기프트샵/장바구니 결제 (cartItemIdxList 기반)
        else if (request.getCartItemIdxList() != null && !request.getCartItemIdxList().isEmpty()) {
            // 주문 중복 생성 방지: 동일 user, 동일 cartItemIdxList, 상태 PENDING인 주문이 있는지 확인
            List<Long> cartItemIdxList = request.getCartItemIdxList();
            long itemCount = cartItemIdxList.size();
            Optional<Order> existingOrderOpt = orderRepository.findPendingOrderByUserAndCartItems(
                user.getUserIdx(), OrderStatus.PENDING, cartItemIdxList, itemCount
            );
            if (existingOrderOpt.isPresent()) {
                // 이미 PENDING 주문이 있으면 그 주문 반환 (로그 남기지 않음)
                return existingOrderOpt.get();
            }
            // 없을 때만 새로 주문 생성
            Order order = Order.builder()
                .user(user)
                .totalAmount(java.math.BigDecimal.valueOf(request.getAmount()))
                .orderStatus(OrderStatus.PENDING) // 결제 전에는 PENDING
                .orderDate(java.time.LocalDateTime.now())
                .build();

            for (Long cartItemIdx : cartItemIdxList) {
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

            // 새로 생성된 주문에만 로그 기록
            userActivityLogService.logActivity(
                user, ActivityType.PAYMENT,
                "기프트샵 주문 생성: 주문번호=" + order.getOrderIdx() + ", 금액=" + request.getAmount(),
                ipAddress
            );
            return order;
        } else {
            throw new IllegalArgumentException("결제 정보가 부족합니다. (reservationNum 또는 cartItemIdxList 필요)");
        }
    }
    
    @Transactional
    public boolean processTossPayment(TossPaymentResponse response, String ipAddress, User user) {
        System.out.println("[processTossPayment] called");
        System.out.println("[processTossPayment] paymentKey: " + response.getPaymentKey());
        System.out.println("[processTossPayment] orderId: " + response.getOrderId());
        System.out.println("[processTossPayment] amount: " + response.getAmount());
        System.out.println("[processTossPayment] status: " + response.getStatus());
        System.out.println("[processTossPayment] message: " + response.getMessage());
        try {
            // 결제 상태 검증
            if (!"DONE".equals(response.getStatus())) {
                userActivityLogService.logActivity(
                    user, ActivityType.PAYMENT_FAILED,
                    "토스 결제 실패: " + response.getMessage() + ", 주문번호=" + response.getOrderId(),
                    ipAddress
                );
                return false;
            }
            
            // 주문 ID에서 결제 유형과 ID를 추출 (예: ORDER_123, RESERVATION_456)
            String[] orderParts = response.getOrderId().split("_");
            String paymentType = orderParts[0];
            String id = orderParts[1];
            
            // 결제 유형에 따라 처리
            if ("RESERVATION".equals(paymentType)) {
                Reservation reservation = reservationRepository.findByReservationNum(id)
                    .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));
                reservation.updateStatus(ReservationStatus.CONFIRMED);
                
                userActivityLogService.logActivity(
                    user, ActivityType.PAYMENT,
                    "토스 결제 완료: 예약번호=" + id + ", 금액=" + response.getAmount(),
                    ipAddress
                );
                return true;
            } else if ("ORDER".equals(paymentType)) {
                // 주문을 새로 생성하지 않고 기존 주문을 찾아 상태만 변경
                Order order = orderRepository.findById(Long.parseLong(id))
                    .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));
                System.out.println("[processTossPayment] order DB status(before): " + order.getOrderStatus());
                boolean wasPaid = order.getOrderStatus() == OrderStatus.PAID;
                if (!wasPaid) {
                    order.updateStatus(OrderStatus.PAID); // 결제완료 등으로 상태 변경
                    orderRepository.save(order);
                    System.out.println("[processTossPayment] order DB status(after): " + order.getOrderStatus());
                    userActivityLogService.logActivity(
                        user, ActivityType.PAYMENT,
                        "토스 결제 완료: 주문번호=" + id + ", 금액=" + response.getAmount(),
                        ipAddress
                    );
                }
                // 이미 PAID 상태면 아무 로그도 남기지 않음
                return true;
            } else {
                throw new IllegalArgumentException("지원하지 않는 결제 유형입니다: " + paymentType);
            }
            
        } catch (Exception e) {
            System.out.println("[processTossPayment] Exception: " + e.getMessage());
            userActivityLogService.logActivity(
                user, ActivityType.PAYMENT_FAILED,
                "토스 결제 처리 중 오류: " + e.getMessage() + ", 주문번호=" + response.getOrderId(),
                ipAddress
            );
            return false;
        }
    }
}
