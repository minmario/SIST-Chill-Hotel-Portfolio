// PointTransactionService.java
package sist.backend.domain.membership.service.interfaces;

import sist.backend.domain.membership.dto.response.PointSummaryResponse;
import sist.backend.domain.membership.dto.response.PointTierSummaryResponse;
import sist.backend.domain.membership.dto.response.PointTransactionResponse;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public interface PointTransactionService {

    List<PointTransactionResponse> getUserPointHistory(Long userIdx, LocalDate start, LocalDate end);

    PointSummaryResponse getUserPointSummary(Long userIdx);

    PointTierSummaryResponse getTierSummary(Long userIdx);

}