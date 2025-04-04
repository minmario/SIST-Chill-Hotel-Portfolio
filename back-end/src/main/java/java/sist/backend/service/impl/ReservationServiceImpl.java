package java.sist.backend.service.impl;

import java.sist.backend.dto.request.ReservationRequestDTO;
import java.sist.backend.dto.response.ReservationResponse;
import java.sist.backend.entity.enums.ReservationStatus;
import java.sist.backend.entity.reservation.ReservationEntity;
import java.sist.backend.repository.jpa.ReservationRepository;
import java.sist.backend.service.interfaces.ReservationService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;

    @Override
    public ReservationResponse createReservation(ReservationRequestDTO request) {
        ReservationEntity reservation = new ReservationEntity();
        reservation.setName(request.getName());
        reservation.setEmail(request.getEmail());
        reservation.setPhone(request.getPhone());
        reservation.setCheckInDate(request.getCheckInDate());
        reservation.setCheckOutDate(request.getCheckOutDate());
        reservation.setRoomType(request.getRoomType());
        reservation.setNumberOfGuests(request.getNumberOfGuests());
        reservation.setAdults(request.getAdults());
        reservation.setPrice(request.getPrice());
        reservation.setStatus(ReservationStatus.PENDING); // 기본값

        ReservationEntity saved = reservationRepository.save(reservation);

        ReservationResponse response = new ReservationResponse();
        response.setId(saved.getId());
        response.setName(saved.getName());
        response.setCheckInDate(saved.getCheckInDate());
        response.setCheckOutDate(saved.getCheckOutDate());
        response.setStatus(saved.getStatus().name());

        return response;
    }
    
    @Override
    public ReservationResponse getReservation(Long userIdx, String reservationNum) {

        ReservationEntity reservation = reservationRepository.findByUserIdxAndReservationNum(userIdx, reservationNum)
                .orElseThrow(() -> new ResourceNotFoundException("해당 예약 정보를 찾을 수 없습니다."));
                
        return new ReservationResponse(reservation);
    }
}