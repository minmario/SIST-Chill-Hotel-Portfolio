package sist.backend.domain.payment.entity;

import java.time.LocalDate;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import sist.backend.domain.user.entity.User;
import sist.backend.global.common.BaseTimeEntity;

@Entity
@Table(name = "payment_method")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PaymentMethod extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_method_idx")
    private Long paymentMethodIdx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_idx", nullable = false)
    private User user;

    @Column(name = "card_type", nullable = false, length = 50)
    private String cardType;

    @Column(name = "last_four_digits", nullable = false, length = 4)
    private String lastFourDigits;

    @Column(name = "owner_name", nullable = false, length = 100)
    private String ownerName;

    @Column(name = "expire_date", nullable = false)
    private LocalDate expireDate;

    @Column(nullable = false)
    private String token;

    // ✅ 기본 결제 수단 여부
    @Column(name = "is_default", nullable = false)
    private Long isDefault;

    // 비즈니스 메서드
    public boolean isExpired() {
        return LocalDate.now().isAfter(expireDate);
    }

    public boolean isValidForPayment() {
        return !isExpired();
    }
}
