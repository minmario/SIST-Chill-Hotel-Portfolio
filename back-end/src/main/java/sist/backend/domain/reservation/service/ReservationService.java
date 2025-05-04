package sist.backend.domain.reservation.service;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

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
import sist.backend.domain.specialoffer.service.SpecialOfferService;
import sist.backend.domain.specialoffer.entity.SpecialOffer;
import sist.backend.domain.user.entity.ActivityType;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.entity.UserActivityLog;
import sist.backend.domain.user.repository.UserActivityLogRepository;
import sist.backend.domain.user.repository.UserRepository;

@Service
@Transactional
@RequiredArgsConstructor
public class ReservationService {

        private final UserActivityLogRepository userActivityLogRepository;

        private final ReservationRepository reservationRepository;
        private final RoomRepository roomRepository;
        private final UserRepository userRepository;
        private final RoomTypeRepository roomTypeRepository;
        private final MembershipRepository membershipRepository;
        private final SpecialOfferService specialOfferService;

        public List<ReservationResponse> saveReservation(ReservationRequest request) {
                System.out.println("[DEBUG] saveReservation() called");
                User user = null;
                Set<Long> usedRoomIds = new HashSet<>();
                if (request.getUserIdx() != null && request.getUserIdx() != 0) {
                        user = userRepository.findByUserIdx(request.getUserIdx())
                                        .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
                }

                List<Reservation> reservations = new ArrayList<>();
                System.out.println("[DEBUG] roomCount: " + request.getRoomCount());
                for (int i = 0; i < request.getRoomCount(); i++) {
                        System.out.println("roomIdx: " + request.getRoomIdxList().get(i));
                        Long roomIdx = request.getRoomIdxList().get(i);

                        if (!usedRoomIds.add(roomIdx)) {
                                throw new IllegalArgumentException("같은 방이 중복 선택되었습니다: " + roomIdx);
                        }
                        Room room = roomRepository.findById(roomIdx)
                                        .orElseThrow(() -> new IllegalArgumentException("객실을 찾을 수 없습니다."));
                        RoomType roomType = roomTypeRepository.findById(request.getRoomTypesIdx())
                                        .orElseThrow(() -> new IllegalArgumentException("객실 타입을 찾을 수 없습니다."));

                        // SpecialOffer 연관관계 처리
                        SpecialOffer specialOffer = null;
                        if (request.getOfferId() != null) {
                                specialOffer = specialOfferService.getAllSpecialOffers().stream()
                                                .filter(so -> so.getId().equals(request.getOfferId()))
                                                .findFirst()
                                                .orElse(null);
                        }

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
                                        .specialOffer(specialOffer)
                                        .build();
                        System.out.println("[DEBUG] reservation: " + reservation);
                        Reservation saved = reservationRepository.save(reservation);
                        reservations.add(saved);
                        // 예약 활동 로그 기록 (IP 제외)
                        String activityDetails = (saved.getRoom() != null && saved.getRoom().getRoomNum() != null)
                                        ? saved.getRoom().getRoomNum() + "호 예약 신청"
                                        : "예약 신청";
                        sist.backend.domain.user.entity.UserActivityLog log = sist.backend.domain.user.entity.UserActivityLog
                                        .builder()
                                        .user(saved.getUser())
                                        .activityType(ActivityType.HOTEL_RESERVATION)
                                        .activityDetails(activityDetails)
                                        .build();
                        userActivityLogRepository.save(log);

                }

                return reservations.stream()
                                .map(ReservationResponse::fromEntity)
                                .collect(Collectors.toList());
        }

        private String generateReservationCode() {
                return "LX" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        }

        @Transactional(readOnly = true)
        public List<ReservationResponse> getReservationsByNumber(String reservationNum) {
                List<Reservation> reservations = reservationRepository.findAllByReservationNum(reservationNum);
                if (reservations == null || reservations.isEmpty()) {
                        throw new IllegalArgumentException("예약 정보를 찾을 수 없습니다.");
                }
                return reservations.stream().map(ReservationResponse::fromEntity).toList();
        }

        @Transactional(readOnly = true)
        public List<ReservationResponse> getReservationsByGuest(String lastName, String firstName, String phone) {
                List<Reservation> reservations = reservationRepository.findByGuestInfo(lastName, firstName, phone);
                if (reservations == null || reservations.isEmpty()) {
                        throw new IllegalArgumentException("예약 정보를 찾을 수 없습니다.");
                }
                return reservations.stream().map(ReservationResponse::fromEntity).toList();
        }

        @Transactional
        public void cancelReservation(String reservationNum) {
                Reservation reservation = reservationRepository.findByReservationNum(reservationNum)
                                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

                reservation.setStatus(ReservationStatus.CANCELLED); // ENUM 업데이트

                // 예약 취소 활동 로그 기록 (IP 제외)
                String activityDetails = (reservation.getRoom() != null && reservation.getRoom().getRoomNum() != null)
                        ? reservation.getRoom().getRoomNum() + "호 예약 취소"
                        : "예약 취소";
                UserActivityLog log = UserActivityLog.builder()
                        .user(reservation.getUser())
                        .activityType(ActivityType.HOTEL_RESERVATION_CANCEL)
                        .activityDetails(activityDetails)
                        .build();
                userActivityLogRepository.save(log);
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

        /**
         * 예약 체크아웃이 완료된 경우, 사용자의 누적 숙박일수를 갱신하고 등급도 갱신합니다.
         * 이 메서드는 프론트 또는 예약 배치 처리에서 호출되어야 합니다.
         *
         * @param reservationNum 체크아웃 완료 처리할 예약번호
         */
        @Transactional
        public void completeReservation(String reservationNum) {
                // ✅ 1. 예약 조회
                Reservation reservation = reservationRepository.findByReservationNum(reservationNum)
                                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

                // ✅ 2. 이미 완료된 예약은 중복 처리 방지
                if (reservation.getStatus() == ReservationStatus.COMPLETED) {
                        return; // 이미 완료 상태면 무시
                }

                // ✅ 3. 예약 상태 변경
                reservation.setStatus(ReservationStatus.COMPLETED);
                reservationRepository.save(reservation);

                // ✅ 4. 숙박일 계산
                long stayDays = ChronoUnit.DAYS.between(reservation.getCheckIn(), reservation.getCheckOut());
                if (stayDays <= 0)
                        stayDays = 1; // 최소 1박 보정

                // ✅ 5. 유저 누적 숙박일수 증가
                User user = reservation.getUser();
                user.setTotalStays(user.getTotalStays() + (int) stayDays);
                userRepository.save(user);

                // ✅ 6. 등급 갱신 트리거 (포인트와 숙박 모두 반영)
                updateMembership(user); // or membershipUpdaterService.updateUserMembershipIfNeeded(user);
        }

}
