package sist.backend.domain.reservation.dto.request;

import lombok.*;
import sist.backend.domain.payment.entity.PaymentMethod;
import sist.backend.domain.reservation.entity.ReservationStatus;
import sist.backend.domain.room.entity.Room;
import sist.backend.domain.user.entity.User;

import java.time.LocalDate;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRequest {

    private Long reservationIdx;
    private User user;
    private Room room;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int adults;
    private int children;
    private ReservationStatus status;
    private int totalAmount;
    private PaymentMethod paymentMethod;
    private String reservationNum;
    private String specialRequest;
}
