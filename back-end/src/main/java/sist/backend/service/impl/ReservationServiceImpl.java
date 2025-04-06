package sist.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sist.backend.dto.request.ReservationRequest;
import sist.backend.dto.response.ReservationResponse;
import sist.backend.domain.reservation.entity.Reservation;
import sist.backend.repository.jpa.ReservationRepository;
import sist.backend.service.interfaces.ReservationService;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;

    @Override
    public ReservationResponse getReservation(Long userIdx, String reservationNum) {
        Reservation entity = reservationRepository.findByUserIdxAndReservationNum(userIdx, reservationNum)
                .orElseThrow(() -> new IllegalArgumentException("예약 정보를 찾을 수 없습니다."));
        return ReservationResponse.fromEntity(entity);
    }

    @Override
    public ReservationResponse createReservation(ReservationRequest request) {
        Reservation entity = Reservation.builder()
                .userIdx(request.getUserIdx())
                .roomIdx(request.getRoomIdx())
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .adults(request.getAdults())
                .status(request.getStatus())
                .totalAmount(request.getTotalAmount())
                .paymentMethodsIdx(request.getPaymentMethodsIdx())
                .reservationNum(request.getReservationNum())
                .specialRequest(request.getSpecialRequest())
                .build();
        return ReservationResponse.fromEntity(reservationRepository.save(entity));
    }
}