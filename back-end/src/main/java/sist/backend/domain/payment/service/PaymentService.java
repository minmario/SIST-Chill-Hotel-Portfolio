package sist.backend.domain.payment.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.orm.ObjectOptimisticLockingFailureException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sist.backend.domain.payment.dto.request.PaymentRequest;
import sist.backend.domain.payment.dto.response.TossPaymentResponse;
import sist.backend.domain.reservation.entity.Reservation;
import sist.backend.domain.reservation.entity.ReservationStatus;
import sist.backend.domain.reservation.repository.ReservationRepository;
import sist.backend.domain.shop.entity.CartItem;
import sist.backend.domain.shop.entity.GiftShop;
import sist.backend.domain.shop.entity.Order;
import sist.backend.domain.shop.entity.OrderItem;
import sist.backend.domain.shop.entity.OrderStatus;
import sist.backend.domain.shop.repository.jpa.CartItemRepository;
import sist.backend.domain.shop.repository.jpa.OrderRepository;
import sist.backend.domain.shop.service.interfaces.CartService;
import sist.backend.domain.user.entity.ActivityType;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.service.interfaces.UserActivityLogService;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ReservationRepository reservationRepository;
    private final UserActivityLogService userActivityLogService;
    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final CartService cartService;

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Order processPayment(PaymentRequest request, String ipAddress, User user) {
        // 결제 수단 검증 - 필수 필드 확인
        if (request.getPaymentMethod() == null || request.getPaymentMethod().isEmpty()) {
            throw new IllegalArgumentException("결제 수단을 선택해주세요.");
        }
        
        // 허용된 결제 수단인지 확인
        String paymentMethod = request.getPaymentMethod();
        if (!paymentMethod.equals("카드") && !paymentMethod.equals("가상계좌") && !paymentMethod.equals("계좌이체")) {
            throw new IllegalArgumentException("유효하지 않은 결제 수단입니다: " + paymentMethod);
        }
        
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
    
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public boolean processTossPayment(TossPaymentResponse response, String ipAddress, User user) {
        try {
            return processTossPaymentInternal(response, ipAddress, user);
        } catch (ObjectOptimisticLockingFailureException ex) {
            log.warn("Optimistic locking failure occurred during payment processing", ex);
            // 동시성 예외 발생 시, 주문/예약 상태가 이미 처리된 경우라면 true 반환(중복 결제 방지)
            String[] orderParts = response.getOrderId() != null ? response.getOrderId().split("_") : new String[0];
            if (orderParts.length >= 2) {
                String paymentType = orderParts[0];
                String id = orderParts[1];
                if ("ORDER".equals(paymentType)) {
                    Optional<Order> orderOpt = orderRepository.findById(Long.parseLong(id));
                    if (orderOpt.isPresent() && orderOpt.get().getOrderStatus() == OrderStatus.PAID) {
                        log.info("Order already paid: {}", id);
                        return true;
                    }
                }
                if ("RESERVATION".equals(paymentType)) {
                    Optional<Reservation> reservationOpt = reservationRepository.findByReservationNum(id);
                    if (reservationOpt.isPresent() && reservationOpt.get().getStatus() == ReservationStatus.CONFIRMED) {
                        log.info("Reservation already confirmed: {}", id);
                        return true;
                    }
                }
            }
            throw ex;
        }
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    protected boolean processTossPaymentInternal(TossPaymentResponse response, String ipAddress, User user) {
        log.info("Processing Toss payment - paymentKey: {}, orderId: {}, amount: {}, status: {}", 
            response.getPaymentKey(), response.getOrderId(), response.getAmount(), response.getStatus());

        if (!"DONE".equals(response.getStatus())) {
            userActivityLogService.logActivity(
                user, ActivityType.PAYMENT_FAILED,
                "토스 결제 실패: " + response.getMessage() + ", 주문번호=" + response.getOrderId(),
                ipAddress
            );
            throw new RuntimeException("토스 결제 실패: " + response.getMessage());
        }
            
        String[] orderParts = response.getOrderId().split("_");
        String paymentType = orderParts[0];
        String id = orderParts[1];
            
        if ("RESERVATION".equals(paymentType)) {
            return processReservationPayment(id, response, ipAddress, user);
        } else if ("ORDER".equals(paymentType)) {
            return processOrderPayment(id, response, ipAddress, user);
        } else {
            throw new IllegalArgumentException("지원하지 않는 결제 유형입니다: " + paymentType);
        }
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    protected boolean processReservationPayment(String reservationNum, TossPaymentResponse response, String ipAddress, User user) {
        Reservation reservation = reservationRepository.findByReservationNum(reservationNum)
            .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));
        reservation.updateStatus(ReservationStatus.CONFIRMED);
        
        userActivityLogService.logActivity(
            user, ActivityType.PAYMENT,
            "토스 결제 완료: 예약번호=" + reservationNum + ", 금액=" + response.getAmount(),
            ipAddress
        );
        return true;
    }

    @Transactional(isolation = Isolation.REPEATABLE_READ)
    protected boolean processOrderPayment(String orderId, TossPaymentResponse response, String ipAddress, User user) {
        Order order = orderRepository.findById(Long.parseLong(orderId))
            .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));
        
        log.info("Processing order payment - current status: {}", order.getOrderStatus());
        
        if (order.getOrderStatus() != OrderStatus.PAID) {
            order.updateStatus(OrderStatus.PAID);
            
            // 결제 성공 시 재고 차감
            processStockDecrease(order);
            
            orderRepository.save(order);
            
            if (user != null) {
                try {
                    cartService.clearCart(user.getUserIdx());
                    log.info("장바구니 비우기 성공: userIdx={}", user.getUserIdx());
                } catch (Exception e) {
                    log.error("장바구니 비우기 실패: {}", e.getMessage());
                    // 장바구니 비우기 실패해도 결제는 성공 처리
                }
            }
            
            userActivityLogService.logActivity(
                user, ActivityType.PAYMENT,
                "토스 결제 완료: 주문번호=" + orderId + ", 금액=" + response.getAmount(),
                ipAddress
            );
        }
        
        return true;
    }

    /**
     * 주문 상품의 재고를 차감하는 메소드
     * @param order 처리할 주문
     */
    private void processStockDecrease(Order order) {
        for (OrderItem orderItem : order.getOrderItems()) {
            GiftShop giftShop = orderItem.getItem();
            int orderQuantity = orderItem.getQuantity();
            
            try {
                // 재고 차감 로직 적용
                boolean stockDecreasedSuccessfully = giftShop.decreaseStock(orderQuantity);
                if (stockDecreasedSuccessfully) {
                    log.info("재고 차감 성공: 상품ID={}, 차감수량={}, 남은재고={}", 
                        giftShop.getItemIdx(), orderQuantity, giftShop.getStockQuantity());
                } else {
                    // 재고 부족 시 로그만 남기고 계속 진행 (이미 주문은 완료 상태)
                    log.warn("재고 부족: 상품ID={}, 필요수량={}, 현재재고={}", 
                        giftShop.getItemIdx(), orderQuantity, giftShop.getStockQuantity());
                    // 가용 재고를 모두 차감
                    giftShop.setStockQuantity(0);
                }
            } catch (Exception e) {
                log.error("재고 차감 중 오류 발생: 상품ID={}, 오류={}", giftShop.getItemIdx(), e.getMessage());
                // 재고 차감 실패해도 주문은 완료 처리
            }
        }
    }
}
