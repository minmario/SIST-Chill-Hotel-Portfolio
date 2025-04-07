package sist.backend.domain.reservation.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "reservation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reservationIdx;
    private Boolean isGuest;
    private String guestName;
    private String guestPhone;
    private String guestEmail;
    private Long userIdx;
    private Long roomIdx;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer adults;
    private Integer children;
    private Integer adultBreakfastCount;
    private Integer childBreakfastCount;
    @Enumerated(EnumType.STRING)
    private ReservationStatus status;
    private BigDecimal totalAmount;
    private Long paymentMethodsIdx;
    private String reservationNum;
    private String specialRequest;
}
