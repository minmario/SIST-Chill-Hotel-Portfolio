package sist.backend.domain.reservation.entity;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
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
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import sist.backend.domain.payment.entity.PaymentMethod;
import sist.backend.domain.room.entity.Room;
import sist.backend.domain.user.entity.User;
import sist.backend.global.common.BaseTimeEntity;

@Entity
@Table(name = "reservation")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Reservation extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationIdx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_idx", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_idx", nullable = false)
    private Room room;

    @Column(nullable = false)
    private LocalDate checkInDate;

    @Column(nullable = false)
    private LocalDate checkOutDate;

    @Column(nullable = false)
    private Integer adults;

    @Column(nullable = false)
    private Integer children;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    @Column(nullable = false, precision = 10, scale = 2)
    private int totalAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_methods_idx")
    private PaymentMethod paymentMethod;

    @Column(unique = true, nullable = false, length = 20)
    private String reservationNum;

    @Column(columnDefinition = "TEXT")
    private String specialRequest;

    // 비즈니스 메서드
    public void updateStatus(ReservationStatus status) {
        this.status = status;
    }

    public void updateSpecialRequest(String specialRequest) {
        this.specialRequest = specialRequest;
    }

    public void updatePaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public int getDurationDays() {
        return (int) ChronoUnit.DAYS.between(checkInDate, checkOutDate);
    }

    public boolean isUpcoming() {
        return LocalDate.now().isBefore(checkInDate) && status == ReservationStatus.CONFIRMED;
    }

    public boolean isActive() {
        LocalDate now = LocalDate.now();
        return !now.isBefore(checkInDate) && !now.isAfter(checkOutDate)
                && status == ReservationStatus.CONFIRMED;
    }
}
