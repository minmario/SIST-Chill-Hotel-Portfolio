package sist.backend.domain.reservation.dto.response;

import lombok.*;
import sist.backend.domain.payment.entity.PaymentMethod;
import sist.backend.domain.reservation.entity.Reservation;
import sist.backend.domain.reservation.entity.ReservationStatus;
import sist.backend.domain.room.entity.Room;
import sist.backend.domain.user.entity.User;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponse {

    private Long reservationIdx;
    private User user;
    private Room room;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int adults;
    private int children;
    private ReservationStatus status;
    private int totalAmount;
    private String paymentMethod;
    private String reservationNum;
    private String specialRequest;

    public static ReservationResponse fromEntity(Reservation entity) {
        return ReservationResponse.builder()
                .reservationIdx(entity.getReservationIdx())
                .user(entity.getUser())
                .room(entity.getRoom())
                .checkInDate(entity.getCheckIn())
                .checkOutDate(entity.getCheckOut())
                .adults(entity.getAdultCount())
                .children(entity.getChildCount())
                .status(entity.getStatus())
                .totalAmount(entity.getTotal())
                .reservationNum(entity.getReservationNum())
                .specialRequest(entity.getSpecialRequests())
                .paymentMethod(entity.getCardNumber())
                .build();
    }
}