package sist.backend.domain.membership.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;
import sist.backend.domain.membership.dto.response.PointSummaryResponse;
import sist.backend.domain.membership.dto.response.PointTierSummaryResponse;
import sist.backend.domain.membership.dto.response.PointTransactionResponse;
import sist.backend.domain.membership.entity.Membership;
import sist.backend.domain.membership.entity.PointTransaction;
import sist.backend.domain.membership.repository.MembershipRepository;
import sist.backend.domain.membership.repository.PointTransactionRepository;
import sist.backend.domain.membership.service.interfaces.PointTransactionService;
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

    @Transactional(readOnly = true)
    public PointSummaryResponse getUserPointSummary(Long userIdx) {
        User user = userRepository.findByUserIdx(userIdx)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음"));

        int totalPoints = user.getTotalPoints();
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
            if (m.getRequiredPoint() > totalPoints) {
                next = m;
                break;
            }
        }

        int pointForNext = next != null ? next.getRequiredPoint() - totalPoints : 0;

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
}