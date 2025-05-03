package sist.backend.domain.reservation.service.Impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sist.backend.domain.reservation.dto.response.AdminReservationResponse;
import sist.backend.domain.reservation.entity.Reservation;
import sist.backend.domain.reservation.entity.ReservationStatus;
import sist.backend.domain.reservation.repository.ReservationRepository;
import sist.backend.domain.reservation.service.interfaces.AdminReservationService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminReservationServiceImpl implements AdminReservationService {

    private final ReservationRepository reservationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AdminReservationResponse> getAllReservations() {
        List<Reservation> reservations = reservationRepository.findAll();

        return reservations.stream()
                .map((Reservation res) -> AdminReservationResponse.builder()
                        .reservationNum(res.getReservationNum())
                        .fullName(res.getLastName() + res.getFirstName())
                        .phone(res.getPhone())
                        .email(res.getEmail())
                        .status(res.getStatus().name())
                        .checkIn(res.getCheckIn())
                        .checkOut(res.getCheckOut())
                        .roomCount(res.getRoomCount() != null ? res.getRoomCount().intValue() : 0)
                        .adultCount(res.getAdultCount())
                        .childCount(res.getChildCount())
                        .roomNumber(res.getRoom() != null ? res.getRoom().getRoomNum() : "N/A")
                        .roomTypeIdx(res.getRoomType() != null ? res.getRoomType().getRoomName() : "N/A")
                        .roomGrade(res.getRoomType() != null ? res.getRoomType().getGrade() : "N/A")
                        .total(res.getTotal())
                        .specialRequests(res.getSpecialRequests())
                        .build())
                .collect(Collectors.toList());

    }

    @Transactional(readOnly = true)
    public AdminReservationResponse getReservationDetail(String reservationNum) {
        Reservation res = reservationRepository.findByReservationNum(reservationNum)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다: " + reservationNum));

        return AdminReservationResponse.builder()
                .reservationNum(res.getReservationNum())
                .fullName(res.getLastName() + res.getFirstName())
                .phone(res.getPhone())
                .email(res.getEmail())
                .status(res.getStatus().name())
                .checkIn(res.getCheckIn())
                .checkOut(res.getCheckOut())
                .roomCount(res.getRoomCount() != null ? res.getRoomCount().intValue() : 0)
                .adultCount(res.getAdultCount())
                .childCount(res.getChildCount())
                .roomNumber(res.getRoom() != null ? res.getRoom().getRoomNum() : "N/A")
                .roomTypeIdx(res.getRoomType() != null ? res.getRoomType().getRoomName() : "N/A")
                .roomGrade(res.getRoomType() != null ? res.getRoomType().getGrade() : "N/A")
                .total(res.getTotal())
                .specialRequests(res.getSpecialRequests())
                .build();
    }

    @Transactional
    public void updateReservationStatus(String reservationNum, String statusString) {
        Reservation reservation = reservationRepository.findByReservationNum(reservationNum)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다: " + reservationNum));

        ReservationStatus status;
        try {
            status = ReservationStatus.valueOf(statusString.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("잘못된 예약 상태입니다: " + statusString);
        }

        reservation.updateStatus(status);
    }
}