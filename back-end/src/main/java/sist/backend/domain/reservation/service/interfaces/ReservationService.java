package sist.backend.domain.reservation.service.interfaces;

import java.util.List;

import sist.backend.domain.reservation.dto.request.ReservationRequestDTO;
import sist.backend.domain.reservation.dto.response.ReservationResponseDTO;

public interface ReservationService {
    ReservationResponseDTO createReservation(ReservationRequestDTO requestDTO);

    ReservationResponseDTO getReservationById(Long reservationIdx);

    List<ReservationResponseDTO> getReservationsByUser(Long userIdx);

    void cancelReservation(Long reservationIdx);
}
