package sist.backend.domain.reservation.service.interfaces;

import java.util.List;

import sist.backend.domain.reservation.dto.response.AdminReservationResponse;

public interface AdminReservationService {
 List<AdminReservationResponse> getAllReservations();
}
