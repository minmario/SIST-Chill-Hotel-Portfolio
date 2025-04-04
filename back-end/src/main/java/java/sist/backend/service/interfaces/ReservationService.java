package java.sist.backend.service.interfaces;

import java.sist.backend.dto.request.ReservationRequestDTO;
import java.sist.backend.dto.response.ReservationResponse;

public interface ReservationService {
    ReservationResponse createReservation(ReservationRequestDTO request);
    ReservationResponse getReservation(Long userIdx, String reservationNum);
    
}