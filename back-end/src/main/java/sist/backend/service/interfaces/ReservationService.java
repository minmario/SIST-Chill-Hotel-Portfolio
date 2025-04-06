package sist.backend.service.interfaces;

import sist.backend.dto.request.ReservationRequest;
import sist.backend.dto.response.ReservationResponse;

public interface ReservationService {
    ReservationResponse createReservation(ReservationRequest request);
    ReservationResponse getReservation(Long userIdx, String reservationNum);
    
}