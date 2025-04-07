package sist.backend.domain.reservation.dto.response;

import lombok.*;
import sist.backend.domain.reservation.entity.enums.ReservationStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponseDTO {
    private Long reservationIdx;
    private Long userId;
    private Long roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer adults;
    private Integer children;
    private Integer adultBreakfastCount;
    private Integer childBreakfastCount;
    private ReservationStatus status;
    private BigDecimal totalAmount;
    private String reservationNum;
    private String specialRequest;
}
