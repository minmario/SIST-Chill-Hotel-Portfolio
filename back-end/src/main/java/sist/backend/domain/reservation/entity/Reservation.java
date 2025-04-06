// ReservationEntity.java
package sist.backend.domain.reservation.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "reservation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_idx")
    private Long reservationIdx;

    @Column(name = "user_idx", nullable = false)
    private Long userIdx;

    @Column(name = "room_idx", nullable = false)
    private Long roomIdx;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;

    @Column(nullable = false)
    private int adults;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    @Column(name = "total_amount", nullable = false)
    private int totalAmount;

    @Column(name = "payment_methods_idx", nullable = false)
    private Long paymentMethodsIdx;

    @Column(name = "reservation_num", nullable = false, unique = true)
    private String reservationNum;

    @Column(name = "special_request")
    private String specialRequest;
}