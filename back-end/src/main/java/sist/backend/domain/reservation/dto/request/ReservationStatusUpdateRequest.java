package sist.backend.domain.reservation.dto.request;

import lombok.Getter;

@Getter
public class ReservationStatusUpdateRequest {
    private String status; // CONFIRMED, CANCELLED, COMPLETED 중 하나
}