package sist.backend.domain.shop.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import sist.backend.domain.user.entity.User;
import sist.backend.global.common.BaseTimeEntity;
<<<<<<< HEAD
import com.fasterxml.jackson.annotation.JsonIgnore;
=======
>>>>>>> vldhtmxk

@Entity
@Table(name = "orders")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Order extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
<<<<<<< HEAD
    @Column(name = "order_idx")
=======
>>>>>>> vldhtmxk
    private Long orderIdx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_idx", nullable = false)
<<<<<<< HEAD
    @JsonIgnore
    private User user;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false)
    private OrderStatus orderStatus;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnore
    private List<OrderItem> orderItems = new ArrayList<>();

    public void updateStatus(OrderStatus status) {
        this.orderStatus = status;
    }

=======
    private User user;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus orderStatus;

    @Column(nullable = false)
    private LocalDateTime orderDate;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    // 주문 항목 추가 메서드
>>>>>>> vldhtmxk
    public void addOrderItem(OrderItem orderItem) {
        orderItems.add(orderItem);
        orderItem.setOrder(this);
    }

<<<<<<< HEAD
    public void calculateTotalAmount() {
        this.totalAmount = orderItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

=======
>>>>>>> vldhtmxk
    // totalAmount 설정 메서드 추가
    public void setTotalAmount(BigDecimal totalAmount) {
        if (totalAmount == null) {
            throw new IllegalArgumentException("총 금액은 null이 될 수 없습니다");
        }
        this.totalAmount = totalAmount;
    }
}
