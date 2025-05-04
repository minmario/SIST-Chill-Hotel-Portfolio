package sist.backend.domain.reservation.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import sist.backend.domain.room.entity.Room;
import sist.backend.domain.room.entity.RoomType;
import sist.backend.domain.specialoffer.entity.SpecialOffer;
import sist.backend.domain.user.entity.User;
import sist.backend.global.common.BaseTimeEntity;

@Entity
@Table(name = "reservation")
@Getter
@Setter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Reservation extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationIdx;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ReservationStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_idx", nullable = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_idx", nullable = false)
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_types_idx", nullable = false)
    private RoomType roomType;

    @Column(name = "reservation_num", nullable = false, unique = true)
    private String reservationNum;

    @Column(name = "check_in", nullable = false)
    private LocalDate checkIn;

    @Column(name = "check_out", nullable = false)
    private LocalDate checkOut;

    @Column(name = "room_count", nullable = false)
    private Integer roomCount;

    @Column(name = "adults", nullable = false)
    private int adultCount;

    @Column(name = "children", nullable = false)
    private int childCount;

    @Column(name = "bed_type")
    private String bedType;

    @Column(name = "special_request", columnDefinition = "TEXT")
    private String specialRequests;

    @Column(name = "room_price", nullable = false)
    private Integer roomPrice;

    @Column(name = "adult_breakfast_price")
    private Integer adultBreakfastPrice;

    @Column(name = "child_breakfast_price")
    private Integer childBreakfastPrice;

    @Column(name = "subtotal")
    private Integer subtotal;

    @Column(name = "discount")
    private Integer discount;

    @Column(name = "total")
    private int total;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "card_number", nullable = false)
    private String cardNumber;

    @Column(name = "card_expiry", nullable = false)
    private String cardExpiry;

    // special_offer 연관관계 (단방향)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offer_id")
    private SpecialOffer specialOffer;

      
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // 비즈니스 메서드
    public void updateStatus(ReservationStatus status) {
        this.status = status;
    }

    public void updateSpecialRequest(String specialRequests) {
        this.specialRequests = specialRequests;
    }

    public int getDurationDays() {
        return (int) ChronoUnit.DAYS.between(checkIn, checkOut);
    }

    public boolean isUpcoming() {
        return LocalDate.now().isBefore(checkIn) && status == ReservationStatus.CONFIRMED;
    }

    public boolean isActive() {
        LocalDate now = LocalDate.now();
        return !now.isBefore(checkIn) && !now.isAfter(checkOut)
                && status == ReservationStatus.CONFIRMED;
    }

    public String getContact() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getContact'");
    }
}
