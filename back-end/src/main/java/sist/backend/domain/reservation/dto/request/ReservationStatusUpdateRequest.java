package sist.backend.domain.reservation.dto.request;

import lombok.Getter;

@Getter
public class ReservationStatusUpdateRequest {
    private String status; // CONFIRMED, CANCELLED, COMPLETED,CHECKED_IN 중 하나
}