package sist.backend.service.interfaces;

import sist.backend.dto.request.ReservationRequestDTO;
import sist.backend.dto.response.ReservationResponse;

public interface ReservationService {
    ReservationResponse createReservation(ReservationRequestDTO request);
    ReservationResponse getReservation(Long userIdx, String reservationNum);
    
}