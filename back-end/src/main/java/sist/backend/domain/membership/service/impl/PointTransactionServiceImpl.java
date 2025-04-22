package sist.backend.domain.membership.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import sist.backend.domain.membership.dto.response.PointSummaryResponse;
import sist.backend.domain.membership.dto.response.PointTransactionResponse;
import sist.backend.domain.membership.entity.PointTransaction;
import sist.backend.domain.membership.repository.PointTransactionRepository;
import sist.backend.domain.membership.service.interfaces.PointTransactionService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PointTransactionServiceImpl implements PointTransactionService {

    private final PointTransactionRepository pointRepo;

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
        Integer total = pointRepo.findTotalPointByUserIdx(userIdx);
        if (total == null)
            total = 0;

        // 🔁 expirationDate 기준으로 소멸 예정 포인트 계산
        LocalDateTime now = LocalDateTime.now();

        int expiring = pointRepo
                .findByUser_UserIdxAndExpirationDateBefore(userIdx, now)
                .stream()
                .filter(p -> p.getPoint() > 0)
                .mapToInt(PointTransaction::getPoint)
                .sum();

        return new PointSummaryResponse(total, total - expiring, expiring);
    }
}