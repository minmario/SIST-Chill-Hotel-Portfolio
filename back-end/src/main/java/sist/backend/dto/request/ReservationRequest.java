package sist.backend.dto.request;

import lombok.*;
import sist.backend.domain.reservation.entity.ReservationStatus;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRequest {

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
}
