package sist.backend.domain.reservation.service;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sist.backend.domain.membership.entity.Membership;
import sist.backend.domain.membership.repository.MembershipRepository;
import sist.backend.domain.reservation.dto.request.ReservationRequest;
import sist.backend.domain.reservation.dto.response.ReservationLookupResponse;
import sist.backend.domain.reservation.dto.response.ReservationResponse;
import sist.backend.domain.reservation.dto.response.StaySummaryResponse;
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
        private final MembershipRepository membershipRepository;

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

        @Transactional(readOnly = true)
        public ReservationLookupResponse getReservationByNumber(String reservationNum) {
                Reservation reservation = reservationRepository.findByReservationNum(reservationNum)
                                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));
                return toLookupDto(reservation); // ✅ 이걸 내부 메서드로 처리
        }

        @Transactional(readOnly = true)
        public ReservationLookupResponse getReservationByGuest(String lastName, String firstName, String phone) {
                Reservation reservation = reservationRepository
                                .findByLastNameAndFirstNameAndPhone(lastName, firstName, phone)
                                .orElseThrow(() -> new IllegalArgumentException("예약 정보를 찾을 수 없습니다."));
                return toLookupDto(reservation);
        }

        private ReservationLookupResponse toLookupDto(Reservation r) {
                int nights = (int) ChronoUnit.DAYS.between(r.getCheckIn(), r.getCheckOut());

                return ReservationLookupResponse.builder()
                                .reservationNum(r.getReservationNum())
                                .fullName(r.getLastName() + r.getFirstName())
                                .phone(r.getPhone())
                                .email(r.getEmail())
                                .roomName(r.getRoom().getRoomType().getRoomName())
                                .roomGrade(r.getRoomType().getGrade())
                                .checkIn(r.getCheckIn())
                                .checkOut(r.getCheckOut())
                                .adultCount(r.getAdultCount())
                                .childCount(r.getChildCount())
                                .totalNights(nights)
                                .totalPrice(r.getTotal())
                                .status(r.getStatus().toString())
                                .build();
        }

        @Transactional
        public void cancelReservation(String reservationNum) {
                Reservation reservation = reservationRepository.findByReservationNum(reservationNum)
                                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

                reservation.setStatus(ReservationStatus.CANCELLED); // ENUM 업데이트
        }

        @Transactional(readOnly = true)
        public StaySummaryResponse getUserStaySummary(Long userIdx) {
                User user = userRepository.findByUserIdx(userIdx)
                                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

                int totalStays = user.getTotalStays();
                Membership current = user.getMembership();

                // 현재 등급보다 높은 등급 중 조건을 만족하지 못한 첫 등급을 찾음
                List<Membership> levels = membershipRepository.findAllByOrderByRequiredStaysAsc();

                Membership nextTier = null;
                for (Membership level : levels) {
                        if (level.getRequiredStays() > totalStays) {
                                nextTier = level;
                                break;
                        }
                }

                int stayForNext = nextTier != null ? nextTier.getRequiredStays() - totalStays : 0;

                return new StaySummaryResponse(
                                (double) totalStays,
                                (double) Math.max(stayForNext, 0),
                                current != null ? current.getTier().name() : "BRONZE", // ← 여기 수정
                                nextTier != null ? nextTier.getTier().name() : null // ← 여기도 수정
                );
        }

        // 내부 등급 클래스
        private record Level(String tier, double required) {
        }

        private void updateMembership(User user) {
                List<Membership> levels = membershipRepository.findAllByOrderByRequiredStaysAsc();

                for (int i = levels.size() - 1; i >= 0; i--) {
                        Membership m = levels.get(i);
                        if (user.getTotalStays() >= m.getRequiredStays()
                                        && user.getTotalPoints() >= m.getRequiredPoint()) {
                                user.setMembership(m); // membership_idx 자동 반영
                                break;
                        }
                }
        }

}
