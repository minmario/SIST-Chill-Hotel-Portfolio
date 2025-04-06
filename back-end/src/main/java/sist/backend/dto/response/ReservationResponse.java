package sist.backend.dto.response;

import lombok.*;
import sist.backend.domain.reservation.entity.Reservation;
import sist.backend.domain.reservation.entity.ReservationStatus;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponse {

    private Long reservationIdx;
    private Long userIdx;
    private Long roomIdx;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int adults;
    private ReservationStatus status;
    private int totalAmount;
    private Long paymentMethodsIdx;
    private String reservationNum;
    private String specialRequest;

    public static ReservationResponse fromEntity(Reservation entity) {
        return ReservationResponse.builder()
                .reservationIdx(entity.getReservationIdx())
                .userIdx(entity.getUserIdx())
                .roomIdx(entity.getRoomIdx())
                .checkInDate(entity.getCheckInDate())
                .checkOutDate(entity.getCheckOutDate())
                .adults(entity.getAdults())
                .status(entity.getStatus())
                .totalAmount(entity.getTotalAmount())
                .paymentMethodsIdx(entity.getPaymentMethodsIdx())
                .reservationNum(entity.getReservationNum())
                .specialRequest(entity.getSpecialRequest())
                .build();
    }
}