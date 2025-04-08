package sist.backend.domain.reservation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import sist.backend.domain.reservation.dto.request.ReservationRequest;
import sist.backend.domain.reservation.dto.response.ReservationResponse;
import sist.backend.domain.reservation.entity.Reservation;
import sist.backend.domain.reservation.repository.ReservationRepository;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;

 
    public ReservationResponse getReservation(Long userIdx, String reservationNum) {
        Reservation entity = reservationRepository.findByUser_UserIdxAndReservationNum(userIdx, reservationNum)
                .orElseThrow(() -> new IllegalArgumentException("예약 정보를 찾을 수 없습니다."));
        return ReservationResponse.fromEntity(entity);
    }

    public ReservationResponse createReservation(ReservationRequest request) {
        Reservation entity = Reservation.builder()
                .user(request.getUser())
                .room(request.getRoom())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .adults(request.getAdults())
                .status(request.getStatus())
                .totalAmount(request.getTotalAmount())
                .paymentMethod(request.getPaymentMethod())
                .reservationNum(request.getReservationNum())
                .specialRequest(request.getSpecialRequest())
                .build();
        return ReservationResponse.fromEntity(reservationRepository.save(entity));
    }
}