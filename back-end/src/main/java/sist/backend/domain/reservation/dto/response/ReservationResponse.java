package sist.backend.domain.reservation.dto.response;

import lombok.*;
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

    private String reservationNum;
    private String guestName;
    private String roomName;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private int totalAmount;
    private String paymentMethod;
    private String specialRequest;
    private Long offerId;
    private String offerName;

    public static ReservationResponse fromEntity(Reservation entity) {
        return ReservationResponse.builder()
                .reservationNum(entity.getReservationNum())
                .guestName(entity.getUser().getLastName() + entity.getUser().getFirstName())
                .roomName(entity.getRoom() != null ? entity.getRoomType().getRoomName() : null)
                .checkIn(entity.getCheckIn())
                .checkOut(entity.getCheckOut())
                .totalAmount(entity.getTotal())
                .paymentMethod(entity.getCardNumber())
                .specialRequest(entity.getSpecialRequests())
                .offerId(entity.getSpecialOffer() != null ? entity.getSpecialOffer().getId() : null)
                .offerName(entity.getSpecialOffer() != null ? entity.getSpecialOffer().getTitle() : null)
                .build();
    }
}