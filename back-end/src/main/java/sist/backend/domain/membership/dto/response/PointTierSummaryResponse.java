package sist.backend.domain.membership.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PointTierSummaryResponse {
    private Integer totalPoints;
    private Integer availablePoints;
    private Integer expiringPoints;

    private String currentTier;
    private String nextTier;
    private Integer pointForNextTier;
}