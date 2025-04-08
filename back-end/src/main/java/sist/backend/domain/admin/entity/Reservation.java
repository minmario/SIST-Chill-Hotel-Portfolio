package sist.backend.domain.admin.entity;


import lombok.*;
import sist.backend.domain.admin.entity.enums.ReservationStatus;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "reservation")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_idx")
    private Long id;

    @Column(name = "user_idx", nullable = false)
    private Long userId;

    @Column(name = "room_idx", nullable = false)
    private Long roomId;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;

    private int adults;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    @Column(name = "total_amount", nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "payment_methods_idx")
    private Long paymentMethodId;

    @Column(name = "reservation_num", nullable = false, unique = true)
    private String reservationNum;

    @Column(name = "special_request")
    private String specialRequest;
}
