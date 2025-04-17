package sist.backend.domain.reservation.service;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sist.backend.domain.reservation.dto.request.ReservationRequest;
import sist.backend.domain.reservation.dto.response.ReservationLookupResponse;
import sist.backend.domain.reservation.dto.response.ReservationResponse;
import sist.backend.domain.reservation.entity.Reservation;
import sist.backend.domain.reservation.entity.ReservationStatus;
import sist.backend.domain.reservation.repository.ReservationRepository;
import sist.backend.domain.room.entity.Room;
import sist.backend.domain.room.entity.RoomType;
import sist.backend.domain.room.repository.RoomRepository;
import sist.backend.domain.room.repository.RoomTypeRepository;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final RoomTypeRepository roomTypeRepository;

        public ReservationResponse getReservation(Long userIdx, String reservationNum) {
                Reservation entity = reservationRepository.findByUser_UserIdxAndReservationNum(userIdx, reservationNum)
                                .orElseThrow(() -> new IllegalArgumentException("예약 정보를 찾을 수 없습니다."));
                return ReservationResponse.fromEntity(entity);
        }

        public Long saveReservation(ReservationRequest request) {
                User user = null;

                if (request.getUserIdx() != null && request.getUserIdx() != 0) {
                        user = userRepository.findByUserIdx(request.getUserIdx())
                                        .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
                }

                Room room = roomRepository.findById(request.getRoomIdx())
                                .orElseThrow(() -> new IllegalArgumentException("객실을 찾을 수 없습니다."));

                RoomType roomType = roomTypeRepository.findById(request.getRoomTypesIdx())
                                .orElseThrow(() -> new IllegalArgumentException("객실 타입을 찾을 수 없습니다."));

                Reservation reservation = Reservation.builder()
                                .status(ReservationStatus.CONFIRMED)
                                .user(user)
                                .room(room)
                                .roomType(roomType)
                                .reservationNum(generateReservationCode())
                                .checkIn(LocalDate.parse(request.getCheckIn()))
                                .checkOut(LocalDate.parse(request.getCheckOut()))
                                .roomCount(request.getRoomCount())
                                .adultCount(request.getAdultCount())
                                .childCount(request.getChildCount())
                                .bedType(request.getBedType())
                                .specialRequests(request.getSpecialRequests())
                                .roomPrice(request.getRoomPrice())
                                .adultBreakfastPrice(request.getAdultBreakfastPrice())
                                .childBreakfastPrice(request.getChildBreakfastPrice())
                                .subtotal(request.getSubtotal())
                                .discount(request.getDiscount())
                                .total(request.getTotal())
                                .firstName(request.getFirstName())
                                .lastName(request.getLastName())
                                .email(request.getEmail())
                                .phone(request.getPhone())
                                .cardNumber(request.getCardNumber())
                                .cardExpiry(request.getCardExpiry())
                                .build();

                reservationRepository.save(reservation);
                return reservation.getReservationIdx();
        }

        private String generateReservationCode() {
                return "LX" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        }

        @Transactional
        public void cancelReservation(String reservationNum) {
        Reservation reservation = reservationRepository.findByReservationNum(reservationNum)
            .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

        reservation.setStatus(ReservationStatus.CANCELLED); // ENUM 업데이트
        }
}
