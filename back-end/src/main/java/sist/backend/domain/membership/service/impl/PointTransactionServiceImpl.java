package sist.backend.domain.membership.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import sist.backend.domain.membership.dto.response.PointSummaryResponse;
import sist.backend.domain.membership.dto.response.PointTierSummaryResponse;
import sist.backend.domain.membership.dto.response.PointTransactionResponse;
import sist.backend.domain.membership.entity.Membership;
import sist.backend.domain.membership.entity.PointTransaction;
import sist.backend.domain.membership.entity.ReferenceType;
import sist.backend.domain.membership.repository.MembershipRepository;
import sist.backend.domain.membership.repository.PointTransactionRepository;
import sist.backend.domain.membership.service.interfaces.MembershipUpdaterService;
import sist.backend.domain.membership.service.interfaces.PointTransactionService;
import sist.backend.domain.reservation.entity.Reservation;
import sist.backend.domain.reservation.repository.ReservationRepository;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.repository.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PointTransactionServiceImpl implements PointTransactionService {

    private final PointTransactionRepository pointRepo;
    private final UserRepository userRepository;
    private final PointTransactionRepository pointTransactionRepository;
    private final MembershipRepository membershipRepository;
    private final MembershipUpdaterService membershipUpdaterService;
    private final ReservationRepository reservationRepository;

    @Override
    public List<PointTransactionResponse> getUserPointHistory(Long userIdx, LocalDate start, LocalDate end) {
        List<PointTransaction> transactions = pointRepo
                .findByUser_UserIdxAndTransactionDateBetweenOrderByTransactionDateAsc(userIdx, start.atStartOfDay(),
                        end.atTime(23, 59, 59));

        List<PointTransactionResponse> result = new ArrayList<>();
        int balance = 0;

        for (PointTransaction pt : transactions) {
            balance += pt.getPoint();
            result.add(PointTransactionResponse.builder()
                    .id(pt.getPointTransactionIdx()) // ✅ 추가
                    .date(pt.getTransactionDate().toLocalDate())
                    .category(pt.getPoint() >= 0 ? "적립" : "사용")
                    .description(pt.getDescription())
                    .earned(pt.getPoint() > 0 ? pt.getPoint() : 0)
                    .used(pt.getPoint() < 0 ? Math.abs(pt.getPoint()) : 0)
                    .balance(balance)
                    .referenceType(pt.getReferenceType().name()) // ✅ enum이면 .name()
                    .referenceId(pt.getReferenceIdx()) // ✅ 추가
                    .build());
        }
        Collections.reverse(result);

        return result;
    }

    @Override
    public PointSummaryResponse getUserPointSummary(Long userIdx) {
        User user = userRepository.findByUserIdx(userIdx)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        membershipUpdaterService.updateUserMembershipIfNeeded(user);

        int totalPoints = user.getTotalPoints();
        int totalStays = user.getTotalStays();
        int availablePoints = pointTransactionRepository.findTotalPointByUserIdx(userIdx);

        // 3개월 이내 소멸 예정 포인트 계산
        LocalDateTime threeMonthsLater = LocalDateTime.now().plusMonths(3);
        List<PointTransaction> expiringList = pointTransactionRepository
                .findByUser_UserIdxAndExpirationDateBefore(userIdx, threeMonthsLater);
        int expiringPoints = expiringList.stream()
                .filter(p -> p.getPoint() > 0)
                .mapToInt(PointTransaction::getPoint)
                .sum();

        Membership current = user.getMembership();

        List<Membership> levels = membershipRepository.findAllByOrderByRequiredPointAsc();
        Membership next = null;

        for (Membership m : levels) {
            boolean pointNotEnough = totalPoints < m.getRequiredPoint();
            boolean stayNotEnough = totalStays < m.getRequiredStays();

            if (pointNotEnough || stayNotEnough) {
                next = m;
                break;
            }
        }

        int pointForNext = next != null ? Math.max(0, next.getRequiredPoint() - totalPoints) : 0;

        return new PointSummaryResponse(
                totalPoints,
                availablePoints,
                expiringPoints,
                current != null ? current.getTier().name() : "BRONZE",
                next != null ? next.getTier().name() : null,
                pointForNext);
    }

    @Override
    public PointTierSummaryResponse getTierSummary(Long userIdx) {
        int total = pointRepo.findTotalPointByUserIdx(userIdx) != null ? pointRepo.findTotalPointByUserIdx(userIdx) : 0;

        LocalDateTime now = LocalDateTime.now();
        int expiring = pointRepo
                .findByUser_UserIdxAndExpirationDateBefore(userIdx, now)
                .stream()
                .filter(p -> p.getPoint() > 0)
                .mapToInt(PointTransaction::getPoint)
                .sum();

        int available = total - expiring;

        String currentTier = "BRONZE";
        String nextTier = "SILVER";
        int pointForNextTier = 10000 - total;

        if (total >= 10000) {
            currentTier = "SILVER";
            nextTier = "GOLD";
            pointForNextTier = 50000 - total;
        }
        if (total >= 50000) {
            currentTier = "GOLD";
            nextTier = "VIP";
            pointForNextTier = 100000 - total;
        }
        if (total >= 100000) {
            currentTier = "VIP";
            nextTier = null;
            pointForNextTier = 0;
        }

        return PointTierSummaryResponse.builder()
                .totalPoints(total)
                .availablePoints(available)
                .expiringPoints(expiring)
                .currentTier(currentTier)
                .nextTier(nextTier)
                .pointForNextTier(pointForNextTier)
                .build();
    }

    /**
     * 사용자가 포인트를 적립할 때, 누적 포인트도 함께 업데이트하고 등급도 갱신합니다.
     *
     * @param userIdx     포인트를 적립할 사용자 ID
     * @param amount      적립할 포인트 수치 (양수만)
     * @param description 적립 사유
     */
    @Transactional
    public void earnPoints(Long userIdx, int amount, String description) {
        User user = userRepository.findByUserIdx(userIdx)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        // ✅ 1. 포인트 트랜잭션 저장
        PointTransaction transaction = PointTransaction.builder()
                .user(user)
                .point(amount)
                .description(description)
                .transactionDate(LocalDateTime.now())
                .expirationDate(LocalDateTime.now().plusYears(1)) // 유효기간 예시
                .referenceType(ReferenceType.USER_ACTIVITY_LOG)
                .referenceIdx(null)
                .build();
        pointTransactionRepository.save(transaction);

        // ✅ 2. 누적 포인트 증가
        user.setTotalPoints(user.getTotalPoints() + amount);
        userRepository.save(user);

        // ✅ 3. 등급 갱신 시도 (조건 만족 시 변경됨)
        membershipUpdaterService.updateUserMembershipIfNeeded(user);
    }

    @Transactional
    public void recalculateAndUpdateUserSummary(Long userIdx) {
        System.out.println("🔥 /summary/update 호출됨, userIdx: " + userIdx);

        // ✅ 사용자 조회
        User user = userRepository.findByUserIdx(userIdx)
                .orElseThrow(() -> {
                    System.out.println("❌ 사용자 없음! userIdx=" + userIdx);
                    return new IllegalArgumentException("사용자 없음");
                });

        // ✅ 총 포인트 계산
        Integer totalPoints = pointTransactionRepository.findTotalPointByUserIdx(userIdx);
        if (totalPoints == null)
            totalPoints = 0;
        System.out.println("📌 총 포인트: " + totalPoints);
        user.setTotalPoints(totalPoints);

        // ✅ 1년 이내 예약 조회
        LocalDate oneYearAgo = LocalDate.now().minusYears(1);
        List<Reservation> reservations = reservationRepository
                .findCompletedReservationsWithin(userIdx, oneYearAgo, LocalDate.now());
        System.out.println("📌 완료된 예약 수: " + reservations.size());

        int totalStays = reservations.stream()
                .mapToInt(Reservation::getDurationDays)
                .sum();
        user.setTotalStays(totalStays);
        System.out.println("📌 총 숙박일수: " + totalStays);

        // ✅ 저장
        userRepository.save(user);
        System.out.println("✅ user 저장 완료");

        // ✅ 등급 갱신
        membershipUpdaterService.updateUserMembershipIfNeeded(user);
        System.out.println("✅ 등급 갱신 완료");
    }
}